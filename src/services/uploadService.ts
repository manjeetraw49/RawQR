import { UploadedImageInfo } from '../types/qr';

export interface ServerStatusResponse {
  status: string;
  storageProviders: {
    cloudinary: boolean;
    supabase: boolean;
    cloudCdn: boolean;
    localDev: boolean;
  };
  activeProvider: 'cloudinary' | 'supabase' | 'cloudCdn' | 'localDev' | string;
  maxSizeBytes: number;
  acceptedTypes: string[];
}

export async function fetchServerStatus(): Promise<ServerStatusResponse | null> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Direct client-side fallback to PixelVault CDN in case backend /api/upload is unreachable
 */
function uploadDirectToPixelVault(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedImageInfo> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.pixelvault.dev/v1/images');

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data?.data?.url) {
          resolve({
            url: data.data.url,
            name: file.name,
            size: file.size,
            type: file.type,
            provider: 'cloudCdn',
          });
          return;
        }
      } catch {}
      reject(new Error('Direct cloud upload failed.'));
    };

    xhr.onerror = () => reject(new Error('Network error during cloud upload.'));
    xhr.timeout = 45000;
    xhr.ontimeout = () => reject(new Error('Cloud upload timed out.'));
    xhr.send(formData);
  });
}

/**
 * Direct client-side fallback to TmpFiles in case PixelVault is unreachable
 */
function uploadDirectToTmpfiles(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedImageInfo> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://tmpfiles.org/api/v1/upload');

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data?.status === 'success' && data.data?.url) {
          const directUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          resolve({
            url: directUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            provider: 'tmpfiles',
          });
          return;
        }
      } catch {}
      reject(new Error('Direct TmpFiles upload failed.'));
    };

    xhr.onerror = () => reject(new Error('Network error during TmpFiles upload.'));
    xhr.timeout = 45000;
    xhr.ontimeout = () => reject(new Error('TmpFiles upload timed out.'));
    xhr.send(formData);
  });
}

/**
 * Uploads an image to storage with multi-layer resilience:
 * 1. Primary: /api/upload endpoint (supports Cloudinary, Supabase, Cloud CDN, local dev)
 * 2. Secondary: Direct PixelVault CDN upload
 * 3. Tertiary: Direct TmpFiles upload
 */
export async function uploadImageToStorage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedImageInfo> {
  // Step 1: Try backend /api/upload
  try {
    const result = await new Promise<UploadedImageInfo>((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        let data: any;
        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          reject(new Error('Invalid response from server.'));
          return;
        }

        if (xhr.status >= 200 && xhr.status < 300 && data.success && data.url) {
          resolve({
            url: data.url,
            name: data.name || file.name,
            size: data.size || file.size,
            type: data.mime || file.type,
            provider: data.provider || 'cloudinary',
          });
        } else {
          reject(new Error(data.error || 'Server upload failed.'));
        }
      };

      xhr.onerror = () => reject(new Error('Backend server unreachable.'));
      xhr.ontimeout = () => reject(new Error('Backend upload timed out.'));
      xhr.timeout = 40000;
      xhr.send(formData);
    });

    return result;
  } catch (backendError) {
    console.warn('[Upload] /api/upload failed or unreachable, trying direct Cloud CDN:', backendError);

    // Step 2: Try direct PixelVault
    try {
      return await uploadDirectToPixelVault(file, onProgress);
    } catch (pixelVaultError) {
      console.warn('[Upload] Direct PixelVault failed, trying TmpFiles:', pixelVaultError);

      // Step 3: Try direct TmpFiles
      try {
        return await uploadDirectToTmpfiles(file, onProgress);
      } catch (tmpFilesError: any) {
        throw new Error(
          'Failed to upload image to any storage provider. Please check your internet connection and try again.'
        );
      }
    }
  }
}
