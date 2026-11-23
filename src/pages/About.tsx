import React from 'react';
import { QrCode, Shield, Zap, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Empowering Seamless Connections Through Minimalist Design
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          RawQR was built with a simple conviction: generating professional, scannable QR codes should be fast, private, and free of dark patterns or intrusive paywalls.
        </p>
      </div>

      {/* Mission Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-blue-50/50 border border-blue-100 mb-16">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/icon.png"
            alt="RawQR Brand Mark"
            className="w-10 h-10 rounded-xl object-contain shadow-xs"
          />
          <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          Too many QR tools on the internet today lure users in, secretly redirect through intermediary tracking domains, and eventually lock codes behind subscriptions or paywalls. At <strong className="text-blue-700">RawQR</strong>, we encode your genuine destination URL directly into the matrix. The QR code belongs to you forever, rendering directly on the device with zero sneaky middleman rerouting.
        </p>
      </div>

      {/* Core Principles */}
      <div className="space-y-8 mb-16">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
          Our Architectural Principles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1.5">
              Zero Intermediary Redirects
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              When you generate a website QR, scanners go straight to your destination. We do not insert tracking domains that break when a company changes its pricing model.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1.5">
              Production-Grade Vector Standards
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every QR code can be exported as scalable vector SVG, guaranteeing crisp edge definition whether printed on a tiny business card or an interstate billboard.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1.5">
              Certified Cloud Image Hosting
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Unlike gimmicks that compress pictures into unreadable barcode blobs, our Image-to-QR pipeline uses enterprise cloud storage with worldwide CDN delivery.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1.5">
              Strict Contrast & Error Correction
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              We guide users away from poorly scannable colors and enforce Level H (30% error correction) whenever a center logo is attached.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-gray-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold">Ready to create a custom QR code?</h3>
          <p className="text-sm text-gray-400 mt-1">
            Generate unlimited website and image QR codes in seconds.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shrink-0"
        >
          <span>Open Generator</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
