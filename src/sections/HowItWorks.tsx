import React from 'react';
import { MousePointerClick, SlidersHorizontal, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Content',
      description:
        'Enter any website URL or upload your image to our secure cloud storage for an instant link.',
      icon: MousePointerClick,
    },
    {
      step: '02',
      title: 'Customize Your QR',
      description:
        'Personalize your QR code with custom foreground and background colors, and add your center brand logo.',
      icon: SlidersHorizontal,
    },
    {
      step: '03',
      title: 'Download and Share',
      description:
        'Export your finished QR code in high-resolution PNG or crisp vector SVG format ready for print or digital.',
      icon: Download,
    },
  ];

  return (
    <section className="py-20 bg-gray-50/60 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            How RawQR Works
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Generate professional, production-ready QR codes in three simple steps without technical knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-gray-200">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-xs">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
