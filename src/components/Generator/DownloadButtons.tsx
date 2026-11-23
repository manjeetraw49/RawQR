import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { QRContentType } from '../../types/qr';
import { getFilename } from '../../utils/downloadQR';

interface DownloadButtonsProps {
  onDownload: (format: 'png' | 'svg') => void;
  isExporting: boolean;
  disabled: boolean;
  contentType: QRContentType;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  onDownload,
  isExporting,
  disabled,
  contentType,
}) => {
  const pngFilename = getFilename(contentType, 'png');
  const svgFilename = getFilename(contentType, 'svg');

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-3">
        {/* PNG Download */}
        <button
          type="button"
          onClick={() => onDownload('png')}
          disabled={disabled || isExporting}
          className={`relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:shadow'
          }`}
          title={disabled ? 'Generate a valid QR code first' : `Download ${pngFilename}`}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Download PNG</span>
        </button>

        {/* SVG Download */}
        <button
          type="button"
          onClick={() => onDownload('svg')}
          disabled={disabled || isExporting}
          className={`relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 border border-gray-300 hover:border-gray-400'
          }`}
          title={disabled ? 'Generate a valid QR code first' : `Download ${svgFilename}`}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
          ) : (
            <Download className="w-4 h-4 text-gray-600" />
          )}
          <span>Download SVG</span>
        </button>
      </div>
    </div>
  );
};
