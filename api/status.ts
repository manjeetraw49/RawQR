import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  const isSupabaseConfigured = Boolean(
    process.env.SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY) &&
    process.env.SUPABASE_BUCKET
  );

  return res.status(200).json({
    status: 'ok',
    storageProviders: {
      cloudinary: isCloudinaryConfigured,
      supabase: isSupabaseConfigured,
      cloudCdn: true,
      localDev: false,
    },
    activeProvider: isCloudinaryConfigured
      ? 'cloudinary'
      : isSupabaseConfigured
      ? 'supabase'
      : 'cloudCdn',
    maxSizeBytes: 10 * 1024 * 1024,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  });
}
