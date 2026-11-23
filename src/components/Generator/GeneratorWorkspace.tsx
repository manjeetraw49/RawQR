import React, { useState } from 'react';
import { GeneratorTabs } from './GeneratorTabs';
import { UrlInput } from './UrlInput';
import { ImageUploader } from './ImageUploader';
import { ColorCustomizer } from './ColorCustomizer';
import { LogoUploader } from './LogoUploader';
import { QRPreview } from './QRPreview';
import { ToastContainer } from '../Toast';
import { useQRCode } from '../../hooks/useQRCode';
import { useImageUpload } from '../../hooks/useImageUpload';
import { QRContentType, ToastNotification } from '../../types/qr';
import { Sliders } from 'lucide-react';

export const GeneratorWorkspace: React.FC = () => {
  const {
    data,
    setData,
    designConfig,
    updateDesign,
    contentType,
    setContentType,
    containerRef,
    isExporting,
    handleDownload,
    resetAll,
    hasValidData,
  } = useQRCode();

  const {
    uploadedInfo,
    isUploading,
    progress: uploadProgress,
    error: uploadError,
    localPreview,
    processAndUpload,
    removeFile,
  } = useImageUpload();

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch tab between URL and Image
  const handleTabChange = (tab: QRContentType) => {
    setContentType(tab);
    if (tab === 'url') {
      // If we had an image URL before, keep or reset
      if (uploadedInfo) {
        // preserve or let user enter new
      }
    } else if (tab === 'image') {
      if (uploadedInfo) {
        setData(uploadedInfo.url);
      } else {
        setData('');
      }
    }
  };

  // URL generation handler
  const handleUrlGenerate = (validUrl: string) => {
    setData(validUrl);
    addToast('success', 'Your scannable QR code is ready in the live preview.', 'QR Code Generated');
  };

  const handleUrlClear = () => {
    setData('');
  };

  // Image upload handler
  const handleFileSelect = async (file: File) => {
    const result = await processAndUpload(file);
    if (result && result.url) {
      setData(result.url);
      addToast(
        'success',
        `Image uploaded to ${result.provider} and QR generated.`,
        'Image Uploaded'
      );
    } else {
      addToast('error', 'Failed to upload image. Please check the requirements and try again.', 'Upload Failed');
    }
  };

  const handleImageRemoved = () => {
    removeFile();
    setData('');
  };

  // Download handler
  const handleDownloadWrapper = async (format: 'png' | 'svg') => {
    try {
      await handleDownload(format);
      addToast('success', `Your ${format.toUpperCase()} file has been downloaded.`, 'Download Complete');
    } catch (err: any) {
      addToast('error', err.message || `Failed to download ${format}.`, 'Download Error');
    }
  };

  const handleClearAll = () => {
    resetAll();
    removeFile();
    addToast('info', 'All inputs, custom logos, and preview have been cleared.');
  };

  return (
    <div id="generator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Workspace Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          
          {/* LEFT COLUMN: Input & Customization (7 cols on desktop) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            
            {/* Header of Workspace */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Configure Your QR Code
              </h3>
            </div>

            {/* Content Tabs (URL vs Image) */}
            <GeneratorTabs activeTab={contentType} onTabChange={handleTabChange} />

            {/* Tab 1: URL to QR */}
            {contentType === 'url' && (
              <UrlInput
                initialUrl={data.startsWith('http') ? data : ''}
                onGenerate={handleUrlGenerate}
                onClear={handleUrlClear}
              />
            )}

            {/* Tab 2: Image to QR */}
            {contentType === 'image' && (
              <ImageUploader
                uploadedInfo={uploadedInfo}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                uploadError={uploadError}
                localPreview={localPreview}
                onFileSelect={handleFileSelect}
                onImageUploaded={(info) => {
                  setData(info.url);
                }}
                onImageRemoved={handleImageRemoved}
              />
            )}

            {/* Customization Section Title */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Customization Suite</span>
                </h4>
              </div>

              {/* Color Customizer */}
              <ColorCustomizer
                foregroundColor={designConfig.foregroundColor}
                backgroundColor={designConfig.backgroundColor}
                onChangeForeground={(color) => updateDesign({ foregroundColor: color })}
                onChangeBackground={(color) => updateDesign({ backgroundColor: color })}
              />

              {/* Center Logo Uploader */}
              <LogoUploader
                logoUrl={designConfig.logoUrl}
                logoSize={designConfig.logoSize}
                onLogoChange={(url) => updateDesign({ logoUrl: url })}
                onLogoSizeChange={(size) => updateDesign({ logoSize: size })}
              />

              {/* Dot & Corner Styling */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="block text-xs font-semibold text-gray-700">
                  Corner Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'extra-rounded', label: 'Curved' },
                    { id: 'square', label: 'Square' },
                    { id: 'dot', label: 'Rounded Dot' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() =>
                        updateDesign({
                          cornersSquareType: style.id as any,
                          cornersDotType: style.id === 'square' ? 'square' : 'dot',
                        })
                      }
                      className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                        designConfig.cornersSquareType === style.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live QR Preview & Actions (5 cols on desktop) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-gray-50/50 flex flex-col justify-center">
            <QRPreview
              containerRef={containerRef}
              data={data}
              contentType={contentType}
              designConfig={designConfig}
              isExporting={isExporting}
              hasValidData={hasValidData}
              onDownload={handleDownloadWrapper}
              onClearAll={handleClearAll}
              onCopySuccess={() => addToast('info', 'Link copied to clipboard.')}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
