import React from 'react';
import {
  Zap,
  Globe,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Download,
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Instant QR Generation',
      description:
        'Real-time rendering directly in your browser. Every change to your URL, image, or styling reflects without delay.',
      icon: Zap,
    },
    {
      title: 'URL to QR',
      description:
        'Converts any valid HTTP or HTTPS website address into an ISO-compliant, scannable QR code that works everywhere.',
      icon: Globe,
    },
    {
      title: 'Image to QR',
      description:
        'Upload your PNG, JPG, or WebP images to secure cloud storage and get a QR code that opens your picture instantly upon scanning.',
      icon: ImageIcon,
    },
    {
      title: 'Custom QR Colors',
      description:
        'Personalize your QR code with custom hex color palettes for foreground dots and card background with built-in contrast safeguards.',
      icon: Palette,
    },
    {
      title: 'Custom Logo Integration',
      description:
        'Embed your brand icon or logo into the center of the QR code with automatic Level-H error correction for maximum scannability.',
      icon: Sparkles,
    },
    {
      title: 'High-Quality Downloads',
      description:
        'Download your QR codes as crystal-clear 1024px PNG raster images or infinite-resolution vector SVG files ready for commercial print.',
      icon: Download,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Engineered for Precision & Aesthetics
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Everything you need to create branded, high-contrast, scannable QR codes for personal and enterprise use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-7 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
