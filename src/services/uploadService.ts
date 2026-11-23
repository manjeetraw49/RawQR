import { UploadedImageInfo } from '../types/qr';

export interface ServerStatusResponse {
  status: string;
  storageProviders: {
    cloudinary: boolean;
    supabase: boolean;
    localDev: boolean;
  };
  activeProvider: 'cloudinary' | 'supabase' | 'localDev';
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

export function uploadImageToStorage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedImageInfo> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');

    // Track upload progress
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      let data: any;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error('Server returned an unexpected non-JSON response.'));
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
        reject(new Error(data.error || 'Failed to upload image. Please try again.'));
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          'Network error occurred during image upload. Please check your connection or backend server.'
        )
      );
    };

    xhr.ontimeout = () => {
      reject(new Error('Upload request timed out. Please try again with a smaller image.'));
    };

    xhr.timeout = 60000; // 60 seconds
    xhr.send(formData);
  });
}
