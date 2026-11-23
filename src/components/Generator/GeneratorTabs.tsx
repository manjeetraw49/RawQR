import React from 'react';
import { Globe, Image as ImageIcon } from 'lucide-react';
import { QRContentType } from '../../types/qr';

interface GeneratorTabsProps {
  activeTab: QRContentType;
  onTabChange: (tab: QRContentType) => void;
}

export const GeneratorTabs: React.FC<GeneratorTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
      <button
        type="button"
        onClick={() => onTabChange('url')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
          activeTab === 'url'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Globe className="w-4 h-4" />
        <span>URL to QR</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('image')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
          activeTab === 'image'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ImageIcon className="w-4 h-4" />
        <span>Image to QR</span>
      </button>
    </div>
  );
};
