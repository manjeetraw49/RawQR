import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Info,
} from 'lucide-react';
import { QRContentType, QRDesignConfig } from '../../types/qr';
import { DownloadButtons } from './DownloadButtons';

interface QRPreviewProps {
  containerRef: React.RefObject<HTMLDivElement>;
  data: string;
  contentType: QRContentType;
  designConfig: QRDesignConfig;
  isExporting: boolean;
  hasValidData: boolean;
  onDownload: (format: 'png' | 'svg') => void;
  onClearAll: () => void;
  onCopySuccess: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  containerRef,
  data,
  contentType,
  designConfig,
  isExporting,
  hasValidData,
  onDownload,
  onClearAll,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      console.warn('Clipboard write failed');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm sticky top-24">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-gray-900 tracking-wide uppercase">
            Live Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasValidData && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reset QR code and inputs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Center QR Canvas Area */}
      <div className="py-6 flex flex-col items-center justify-center min-h-[360px]">
        <div
          className="relative p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center"
          style={{ backgroundColor: designConfig.backgroundColor || '#ffffff' }}
        >
          {/* QR Code Canvas injected here */}
          <div
            ref={containerRef}
            className="flex items-center justify-center w-[280px] h-[280px] sm:w-[300px] sm:h-[300px]"
          />

          {/* Overlay when no valid data has been entered */}
          {!hasValidData && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 shadow-xs">
                <Info className="w-5 h-5" />
              </div>
              <h5 className="text-xs font-semibold text-gray-900">
                Awaiting Input
              </h5>
              <p className="text-[11px] text-gray-500 max-w-[200px] mt-1">
                {contentType === 'url'
                  ? 'Enter a valid website URL to render your scannable QR code.'
                  : 'Upload an image above to generate a permanent scannable QR link.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content summary box */}
      <div className="mb-6">
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase">
              {contentType === 'image' ? 'Image Destination URL' : 'Website Destination URL'}
            </span>
            {hasValidData && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium p-1 hover:bg-blue-50 rounded"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <a
                  href={data}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          <p
            className={`font-mono text-xs truncate ${
              hasValidData ? 'text-gray-900' : 'text-gray-400 italic'
            }`}
          >
            {hasValidData ? data : 'No destination configured yet.'}
          </p>
        </div>
      </div>

      {/* Download Action Section */}
      <DownloadButtons
        onDownload={onDownload}
        isExporting={isExporting}
        disabled={!hasValidData}
        contentType={contentType}
      />
    </div>
  );
};
