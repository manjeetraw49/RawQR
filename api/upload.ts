import type { VercelRequest, VercelResponse } from '@vercel/node';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

// Disable Vercel's default bodyParser for file stream handling
export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    // Run Multer to parse multipart/form-data
    await runMiddleware(req, res, upload.single('image'));

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }

    // Verify magic bytes
    const verification = validateImageMagicBytes(file.buffer);
    if (!verification.isValid) {
      return res.status(400).json({
        success: false,
        error: verification.error || 'Invalid image file signature.',
      });
    }

    const mime = verification.mime!;
    const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    const timestamp = Date.now();
    const cleanBaseName = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueFilename = `rawqr_${timestamp}_${cleanBaseName}.${ext}`;

    // 1. Try Cloudinary
    const isCloudinary = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (isCloudinary) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });

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

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        provider: 'cloudinary',
        name: file.originalname,
        size: file.size,
        mime,
      });
    }

    // 2. Try Supabase
    const isSupabase = Boolean(
      process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY) &&
      process.env.SUPABASE_BUCKET
    );

    if (isSupabase) {
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY!;
      const supabase = createClient(process.env.SUPABASE_URL!, supabaseKey);
      const bucketName = process.env.SUPABASE_BUCKET || 'rawqr-images';
      const filePath = `uploads/${uniqueFilename}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: mime,
          upsert: true,
        });

      if (uploadError) {
        return res.status(500).json({
          success: false,
          error: `Supabase upload failed: ${uploadError.message}`,
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return res.status(200).json({
        success: true,
        url: publicUrlData.publicUrl,
        provider: 'supabase',
        name: file.originalname,
        size: file.size,
        mime,
      });
    }

    // If no cloud credentials are configured on Vercel
    return res.status(500).json({
      success: false,
      error:
        'Cloud storage is not configured yet on Vercel. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your Vercel Project Environment Variables.',
    });
  } catch (err: any) {
    console.error('Vercel upload error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Server error occurred during upload.',
    });
  }
}
