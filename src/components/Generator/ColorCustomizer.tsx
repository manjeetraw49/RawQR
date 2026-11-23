import React from 'react';
import { Palette, AlertCircle } from 'lucide-react';

interface ColorCustomizerProps {
  foregroundColor: string;
  backgroundColor: string;
  onChangeForeground: (color: string) => void;
  onChangeBackground: (color: string) => void;
}

// Preset color pairings with proven high contrast
const COLOR_PRESETS = [
  { name: 'Classic', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Royal Blue', fg: '#1D4ED8', bg: '#FFFFFF' },
  { name: 'Slate Dark', fg: '#0F172A', bg: '#F8FAFC' },
  { name: 'Emerald', fg: '#065F46', bg: '#F0FDF4' },
  { name: 'Violet', fg: '#5B21B6', bg: '#F5F3FF' },
  { name: 'Inverted', fg: '#FFFFFF', bg: '#111827' },
];

/**
 * Calculates luminance for contrast checking.
 */
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return 0.5;

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrastRatio(fg: string, bg: string): number {
  try {
    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 10;
  }
}

export const ColorCustomizer: React.FC<ColorCustomizerProps> = ({
  foregroundColor,
  backgroundColor,
  onChangeForeground,
  onChangeBackground,
}) => {
  const contrastRatio = calculateContrastRatio(foregroundColor, backgroundColor);
  const isPoorContrast = contrastRatio < 2.5;

  const handleHexChange = (
    val: string,
    setter: (c: string) => void
  ) => {
    let clean = val.trim();
    if (!clean.startsWith('#')) clean = '#' + clean;
    setter(clean);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-600" />
          <span>Colors & Contrast</span>
        </h4>
        <span className="text-[11px] text-gray-500">Live preview enabled</span>
      </div>

      {/* Preset Pills */}
      <div>
        <div className="text-xs text-gray-500 mb-2">
          <span>Quick Palettes:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((p) => {
            const isSelected =
              foregroundColor.toLowerCase() === p.fg.toLowerCase() &&
              backgroundColor.toLowerCase() === p.bg.toLowerCase();

            return (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  onChangeForeground(p.fg);
                  onChangeBackground(p.bg);
                }}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-600'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center -space-x-1">
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: p.fg }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: p.bg }}
                  />
                </span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Foreground Color */}
        <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
          <label className="block text-xs font-semibold text-gray-700">
            QR Dots (Foreground)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={foregroundColor}
              onChange={(e) => onChangeForeground(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              title="Pick QR code foreground color"
            />
            <input
              type="text"
              value={foregroundColor}
              onChange={(e) => handleHexChange(e.target.value, onChangeForeground)}
              maxLength={7}
              placeholder="#000000"
              className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
          <label className="block text-xs font-semibold text-gray-700">
            Card Background
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onChangeBackground(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              title="Pick QR code background color"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => handleHexChange(e.target.value, onChangeBackground)}
              maxLength={7}
              placeholder="#FFFFFF"
              className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contrast Warning */}
      {isPoorContrast && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <span className="font-semibold">Low Contrast Warning: </span>
            The foreground and background colors are very close in brightness ({contrastRatio.toFixed(1)}:1). Smartphone cameras may have trouble scanning this QR code. We recommend maintaining strong contrast.
          </div>
        </div>
      )}
    </div>
  );
};
