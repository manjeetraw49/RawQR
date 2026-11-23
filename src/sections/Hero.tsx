import React, { useState, useEffect } from 'react';
import { Globe, Image as ImageIcon, Sparkles, Layers, ArrowDown } from 'lucide-react';

interface AnimatedWord {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ANIMATED_WORDS: AnimatedWord[] = [
  {
    text: 'Websites',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50/80',
    borderColor: 'border-blue-200',
    icon: Globe,
  },
  {
    text: 'Images',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-200',
    icon: ImageIcon,
  },
  {
    text: 'Brands',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50/80',
    borderColor: 'border-violet-200',
    icon: Sparkles,
  },
  {
    text: 'Vectors',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50/80',
    borderColor: 'border-indigo-200',
    icon: Layers,
  },
];

export const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ANIMATED_WORDS.length);
        setAnimating(false);
      }, 240);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const current = ANIMATED_WORDS[currentIndex];
  const IconComponent = current.icon;

  const scrollToGenerator = () => {
    const el = document.getElementById('generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-14 pb-8 sm:pt-20 sm:pb-12 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Animated Main Headline */}
        <h1
          style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
          className="font-pixelify text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.15]"
        >
          Generate{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            QR Codes
          </span>{' '}
          for
          <div className="mt-2.5 sm:mt-3 flex items-center justify-center">
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-2xl border shadow-sm transition-all duration-300 transform ${
                current.bgColor
              } ${current.borderColor} ${
                animating
                  ? 'opacity-0 -translate-y-2 scale-95'
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              <div className={`p-1.5 rounded-xl bg-white shadow-xs ${current.color}`}>
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span
                style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
                className={`font-pixelify text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight ${current.color}`}
              >
                {current.text}
              </span>
            </div>
          </div>
        </h1>

        {/* Quick interactive jump button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={scrollToGenerator}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-all shadow-xs hover:shadow group"
          >
            <span>Create Your QR Code</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
