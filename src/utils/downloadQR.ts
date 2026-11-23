import type QRCodeStyling from 'qr-code-styling';
import { QRContentType } from '../types/qr';

export interface DownloadOptions {
  qrCode: QRCodeStyling | null;
  format: 'png' | 'svg';
  contentType: QRContentType;
}

export function getFilename(contentType: QRContentType, format: 'png' | 'svg'): string {
  const baseName = contentType === 'image' ? 'rawqr-image' : 'rawqr-website';
  return `${baseName}.${format}`;
}

/**
 * Downloads QR Code in PNG or SVG format.
 * Includes a robust fallback using getRawData and blob download if direct download has any issues.
 */
export async function downloadQR({ qrCode, format, contentType }: DownloadOptions): Promise<void> {
  if (!qrCode) {
    throw new Error('QR code instance is not available for download.');
  }

  const name = contentType === 'image' ? 'rawqr-image' : 'rawqr-website';
  const filename = `${name}.${format}`;

  try {
    // Primary approach: library's built-in download method
    await qrCode.download({
      name,
      extension: format,
    });
  } catch (primaryErr) {
    console.warn('qrCode.download encountered an issue, trying raw blob fallback...', primaryErr);

    try {
      // Fallback: fetch raw blob and trigger direct download
      const rawData = await qrCode.getRawData(format);
      if (!rawData) {
        throw new Error('Could not retrieve QR code data for export.');
      }

      const blob = rawData instanceof Blob ? rawData : new Blob([rawData as unknown as BlobPart]);
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (fallbackErr: any) {
      console.error('All download methods failed:', fallbackErr);
      throw new Error(`Failed to download ${format.toUpperCase()} file: ${fallbackErr.message || 'Unknown error'}`);
    }
  }
}
