import { useState, useCallback } from 'react';
import { UploadedImageInfo } from '../types/qr';
import { validateImageFile } from '../utils/validateImage';
import { uploadImageToStorage } from '../services/uploadService';

export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploadedInfo, setUploadedInfo] = useState<UploadedImageInfo | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const processAndUpload = useCallback(
    async (selectedFile: File): Promise<UploadedImageInfo | null> => {
      setError(null);

      // 1. Validate file
      const validation = validateImageFile(selectedFile);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file.');
        return null;
      }

      setFile(selectedFile);

      // Local preview URL for instant visual feedback
      const previewUrl = URL.createObjectURL(selectedFile);
      setLocalPreview(previewUrl);

      // 2. Perform upload to cloud storage
      setIsUploading(true);
      setProgress(5);

      try {
        const info = await uploadImageToStorage(selectedFile, (percent) => {
          setProgress(Math.max(5, percent));
        });

        setUploadedInfo(info);
        setProgress(100);
        return info;
      } catch (err: any) {
        console.error('Image upload failed:', err);
        setError(err.message || 'Image upload failed. Please try again.');
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const removeFile = useCallback(() => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }
    setFile(null);
    setLocalPreview(null);
    setUploadedInfo(null);
    setProgress(0);
    setError(null);
  }, [localPreview]);

  return {
    file,
    localPreview,
    uploadedInfo,
    isUploading,
    progress,
    error,
    setError,
    processAndUpload,
    removeFile,
  };
}
