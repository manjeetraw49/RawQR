import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup local uploads directory for development fallback
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Serve public uploads statically if local storage fallback is used
app.use('/uploads', express.static(UPLOAD_DIR));

// Configure Cloudinary if credentials are present
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('[Storage] Cloudinary configured successfully.');
}

// Configure Supabase if credentials are present
const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL &&
  (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY) &&
  process.env.SUPABASE_BUCKET
);

let supabaseClient: any = null;
if (isSupabaseConfigured) {
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY!;
  supabaseClient = createClient(process.env.SUPABASE_URL!, supabaseKey);
  console.log('[Storage] Supabase Storage configured successfully.');
}

// Configure Multer for in-memory file handling (max 10MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * Validates file buffer magic bytes to ensure it is actually a real PNG, JPEG, or WebP.
 */
function validateImageMagicBytes(buffer: Buffer): { isValid: boolean; mime?: string; error?: string } {
  if (!buffer || buffer.length < 12) {
    return { isValid: false, error: 'File is too small or empty.' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0D &&
    buffer[5] === 0x0A &&
    buffer[6] === 0x1A &&
    buffer[7] === 0x0A
  ) {
    return { isValid: true, mime: 'image/png' };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { isValid: true, mime: 'image/jpeg' };
  }

  // WebP: 'RIFF' at 0..3 and 'WEBP' at 8..11
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') {
    return { isValid: true, mime: 'image/webp' };
  }

  return {
    isValid: false,
    error: 'Invalid file format. File signature does not match a valid PNG, JPG, or WebP image.',
  };
}

async function uploadToCloudCdn(buffer: Buffer, filename: string, mime: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', new Blob([new Uint8Array(buffer)], { type: mime }), filename);
  try {
    const res = await fetch('https://api.pixelvault.dev/v1/images', {
      method: 'POST',
      body: fd,
    });
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data?.data?.url) return data.data.url;
    }
  } catch (err) {
    console.warn('[Storage] PixelVault CDN error, trying TmpFiles:', err);
  }

  // TmpFiles fallback
  const fdTmp = new FormData();
  fdTmp.append('file', new Blob([new Uint8Array(buffer)], { type: mime }), filename);
  const resTmp = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: fdTmp,
  });
  if (resTmp.ok) {
    const dataTmp = (await resTmp.json()) as any;
    if (dataTmp?.status === 'success' && dataTmp.data?.url) {
      return dataTmp.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
    }
  }
  throw new Error('Cloud CDN upload unavailable');
}

// Health and configuration check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    storageProviders: {
      cloudinary: isCloudinaryConfigured,
      supabase: isSupabaseConfigured,
      localDev: true,
    },
    activeProvider: isCloudinaryConfigured
      ? 'cloudinary'
      : isSupabaseConfigured
      ? 'supabase'
      : 'localDev',
    maxSizeBytes: 10 * 1024 * 1024,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  });
});

// Secure image upload endpoint
app.post('/api/upload', upload.single('image'), async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, error: 'No image file provided.' });
      return;
    }

    // Verify magic bytes
    const verification = validateImageMagicBytes(file.buffer);
    if (!verification.isValid) {
      res.status(400).json({
        success: false,
        error: verification.error || 'Invalid image file signature.',
      });
      return;
    }

    const mime = verification.mime!;
    const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    const timestamp = Date.now();
    const cleanBaseName = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueFilename = `rawqr_${timestamp}_${cleanBaseName}.${ext}`;

    // 1. Try Cloudinary if configured
    if (isCloudinaryConfigured) {
      const uploadPromise = new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'rawqr_uploads',
            resource_type: 'image',
            public_id: `rawqr_${timestamp}_${cleanBaseName}`,
            format: ext,
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error('Cloudinary upload returned empty result'));
            } else {
              resolve(result);
            }
          }
        );
        stream.end(file.buffer);
      });

      const result = await uploadPromise;

      res.status(200).json({
        success: true,
        url: result.secure_url,
        provider: 'cloudinary',
        name: file.originalname,
        size: file.size,
        mime,
      });
      return;
    }

    // 2. Try Supabase if configured
    if (isSupabaseConfigured && supabaseClient) {
      const bucketName = process.env.SUPABASE_BUCKET || 'rawqr-images';
      const filePath = `uploads/${uniqueFilename}`;

      const { error: uploadError } = await supabaseClient.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: mime,
          upsert: true,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        res.status(500).json({
          success: false,
          error: `Supabase upload failed: ${uploadError.message}`,
        });
        return;
      }

      const { data: publicUrlData } = supabaseClient.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      res.status(200).json({
        success: true,
        url: publicUrlData.publicUrl,
        provider: 'supabase',
        name: file.originalname,
        size: file.size,
        mime,
      });
      return;
    }

    // 3. Try Cloud CDN (Provides a real public URL for scannable QR codes)
    try {
      const cdnUrl = await uploadToCloudCdn(file.buffer, uniqueFilename, mime);
      res.status(200).json({
        success: true,
        url: cdnUrl,
        provider: 'cloudCdn',
        name: file.originalname,
        size: file.size,
        mime,
      });
      return;
    } catch {
      // Offline fallback: save locally
    }

    // 4. Local Disk Fallback
    const destinationPath = path.join(UPLOAD_DIR, uniqueFilename);
    fs.writeFileSync(destinationPath, file.buffer);

    // Build the accessible server URL
    const protocol = req.protocol || 'http';
    const host = req.get('host') || `localhost:${PORT}`;
    const localUrl = `${protocol}://${host}/uploads/${uniqueFilename}`;

    res.status(200).json({
      success: true,
      url: localUrl,
      provider: 'localDev',
      name: file.originalname,
      size: file.size,
      mime,
      notice: 'Uploaded to local server.',
    });
  } catch (error: any) {
    console.error('Image upload failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while processing image upload.',
    });
  }
});

// Serve frontend in production if built
const DIST_DIR = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[RawQR Backend] Server listening on port ${PORT}`);
});
