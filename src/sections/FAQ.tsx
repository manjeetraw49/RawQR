import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Is RawQR free to use?',
      answer:
        'Yes, RawQR is 100% free to use. You can generate unlimited QR codes for website URLs and images, customize their appearance, and download both PNG and vector SVG formats without sign-up or hidden fees.',
    },
    {
      question: 'How do I create a QR code for a website?',
      answer:
        'Select the "URL to QR" tab in the generator workspace, enter your destination website address (starting with http:// or https://), and click "Generate QR". Customize colors or add a center logo if desired, and click "Download PNG" or "Download SVG" to save your file.',
    },
    {
      question: 'Can I convert an image into a QR code?',
      answer:
        'Yes! RawQR features a dedicated "Image to QR" mode. Because QR codes cannot directly encode large high-resolution images, RawQR securely uploads your image to cloud storage (such as Cloudinary or Supabase), obtains a permanent public HTTPS URL, and generates a QR code pointing directly to your image.',
    },
    {
      question: 'Can I customize QR code colors?',
      answer:
        'Absolutely. You can choose any hex color for both the foreground QR dots and the card background. RawQR includes a built-in contrast evaluator that alerts you if your chosen color combination is too low in contrast, preventing scannability issues.',
    },
    {
      question: 'Can I add my own logo?',
      answer:
        'Yes. You can upload your company or personal logo (PNG, JPG, or SVG). When a logo is detected, RawQR automatically locks Error Correction to Level H (High), ensuring that even with 30% of the QR matrix obscured by your logo, the code remains fully scannable by all smartphones.',
    },
    {
      question: 'What is the difference between PNG and SVG?',
      answer:
        'PNG is a high-resolution raster image (1024×1024 pixels) ideal for digital screens, websites, and social media. SVG is a mathematical vector format that scales infinitely without losing sharpness or pixelating, making it the industry standard for billboards, print media, business cards, and merchandise.',
    },
    {
      question: 'Does my QR code expire?',
      answer:
        'No, the QR code itself is static and never expires. The encoded URL or data is permanently stamped into the visual QR pattern. However, for the QR code to continue taking scanners to your content, the destination website address or cloud-hosted image link must remain active and accessible on the web.',
    },
    {
      question: 'Will my image QR work if I delete the uploaded image?',
      answer:
        'No. A QR code only points to the address where your image lives. If you delete or remove the image from your cloud storage host, the URL will return a 404 (Not Found) error when someone scans the QR code. Keep your image file active in cloud storage as long as you want the QR code to function.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50/50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3 text-sm sm:text-base">
                    <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-150">
                    {faq.answer}
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
