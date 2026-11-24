export type QRContentType = 'url' | 'image';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type DotsStyleType = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded';
export type CornerSquareStyleType = 'square' | 'dot' | 'extra-rounded';
export type CornerDotStyleType = 'square' | 'dot';

export interface QRDesignConfig {
  foregroundColor: string;
  backgroundColor: string;
  errorCorrection: ErrorCorrectionLevel;
  logoUrl: string | null;
  logoFile?: File | null;
  logoSize: number; // e.g. 0.2 to 0.45
  dotsType: DotsStyleType;
  cornersSquareType: CornerSquareStyleType;
  cornersDotType: CornerDotStyleType;
}

export interface UploadedImageInfo {
  url: string;
  name: string;
  size: number;
  type: string;
  provider: 'cloudinary' | 'supabase' | 'server' | 'cloudCdn' | 'tmpfiles' | 'localDev' | string;
  dimensions?: { width: number; height: number };
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}
