import React, { useRef } from 'react';
import { Upload, X, Sliders } from 'lucide-react';

interface LogoUploaderProps {
  logoUrl: string | null;
  logoSize: number;
  onLogoChange: (url: string | null) => void;
  onLogoSizeChange: (size: number) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  logoUrl,
  logoSize,
  onLogoChange,
  onLogoSizeChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size should be under 2MB for optimal loading.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onLogoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">
          Center Logo Embed
        </h4>
        <span className="text-[11px] text-gray-500">Auto Error-Correction (H)</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/svg+xml, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* When Logo is selected */}
      {logoUrl ? (
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 p-1 flex items-center justify-center overflow-hidden shadow-xs">
                <img
                  src={logoUrl}
                  alt="Embedded Logo Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-900 block">
                  Center Logo Attached
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">
                  High Error Correction (30% recovery) Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                title="Remove logo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Size slider */}
          <div className="space-y-1.5 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Logo Scale
              </span>
              <span className="font-mono">{Math.round(logoSize * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.15}
              max={0.38}
              step={0.01}
              value={logoSize}
              onChange={(e) => onLogoSizeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Small (Discreet)</span>
              <span>Medium (Recommended)</span>
              <span>Max Safe Size</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty upload state */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-xl border border-dashed border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50/50 cursor-pointer flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-800 block">
                Add Brand Logo or Icon
              </span>
              <span className="text-[11px] text-gray-500">
                PNG, SVG, or JPG (transparent PNG recommended)
              </span>
            </div>
          </div>

          <span className="text-xs font-semibold text-blue-600 px-3 py-1 rounded-md bg-blue-50">
            Upload
          </span>
        </div>
      )}
    </div>
  );
};
