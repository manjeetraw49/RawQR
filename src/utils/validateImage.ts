import { ValidationResult } from '../types/qr';

export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validates image file type and file size.
 */
export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return {
      isValid: false,
      error: 'No file selected.',
    };
  }

  // Check MIME type
  const normalizedType = file.type.toLowerCase();
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  const isAcceptedMime = ACCEPTED_IMAGE_TYPES.includes(normalizedType);
  const isAcceptedExt = ['png', 'jpg', 'jpeg', 'webp'].includes(fileExtension || '');

  if (!isAcceptedMime && !isAcceptedExt) {
    return {
      isValid: false,
      error: `Unsupported file type (${file.type || 'unknown'}). Please upload a PNG, JPG, JPEG, or WebP image.`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size exceeds 10MB limit (${sizeInMB}MB). Please upload a smaller image.`,
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The uploaded file is empty.',
    };
  }

  return {
    isValid: true,
  };
}
