import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cloud,
} from 'lucide-react';
import { UploadedImageInfo } from '../../types/qr';

interface ImageUploaderProps {
  onImageUploaded: (info: UploadedImageInfo) => void;
  onImageRemoved: () => void;
  uploadedInfo: UploadedImageInfo | null;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  localPreview: string | null;
  onFileSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageRemoved,
  uploadedInfo,
  isUploading,
  uploadProgress,
  uploadError,
  localPreview,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      onFileSelect(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      onFileSelect(selected);
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Upload Image for QR Generation
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Your image will be securely uploaded to cloud storage to generate a scannable, permanent URL.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* State 1: Uploading progress */}
      {isUploading && (
        <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/50 flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 animate-pulse">
            <UploadCloud className="w-6 h-6 animate-bounce" />
          </div>
          <div className="text-center">
            <h5 className="text-sm font-semibold text-gray-900">
              Uploading image to Cloud Storage...
            </h5>
            <p className="text-xs text-gray-500 mt-0.5">
              Validating format and generating secure public HTTPS URL
            </p>
          </div>

          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-blue-700">{uploadProgress}%</span>
        </div>
      )}

      {/* State 2: Uploaded & ready preview */}
      {!isUploading && uploadedInfo && (
        <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-4 shadow-sm">
          <div className="flex items-start gap-4">
            {localPreview ? (
              <img
                src={localPreview}
                alt="Uploaded thumbnail"
                className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-xs"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle className="w-3 h-3" />
                  Uploaded Successfully
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Cloud className="w-3 h-3" />
                  {uploadedInfo.provider === 'cloudinary'
                    ? 'Cloudinary CDN'
                    : uploadedInfo.provider === 'supabase'
                    ? 'Supabase Storage'
                    : uploadedInfo.provider === 'cloudCdn'
                    ? 'Cloud CDN'
                    : uploadedInfo.provider === 'tmpfiles'
                    ? 'TmpFiles CDN'
                    : 'Cloud Storage'}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {uploadedInfo.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {(uploadedInfo.size / (1024 * 1024)).toFixed(2)} MB • {uploadedInfo.type}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <a
                  href={uploadedInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  <span>Open Hosted Image</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={triggerBrowse}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace Image</span>
            </button>

            <button
              type="button"
              onClick={onImageRemoved}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Image</span>
            </button>
          </div>
        </div>
      )}

      {/* State 3: Empty / Dropzone */}
      {!isUploading && !uploadedInfo && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
          }`}
        >
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h5 className="text-sm font-semibold text-gray-900 mb-1">
            Drag and drop your image here
          </h5>
          <p className="text-xs text-gray-500 mb-3">
            or <span className="text-blue-600 font-medium underline">browse files</span> from your computer
          </p>

          <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
              PNG, JPG, JPEG, WebP
            </span>
            <span>•</span>
            <span>Max 10 MB</span>
          </div>
        </div>
      )}

      {/* Upload error alert */}
      {uploadError && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Upload failed: </span>
            {uploadError}
          </div>
        </div>
      )}

      {/* Persistence explanation note */}
      <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-gray-700">Important:</strong> QR codes encode text and URLs. When you upload an image, RawQR stores it on cloud storage and generates a QR code containing its public HTTPS link so scanners can view it anytime.
        </p>
      </div>
    </div>
  );
};
