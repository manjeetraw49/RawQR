import React from 'react';
import { Shield, Lock, EyeOff, Server, HardDrive } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Privacy Policy & Data Practices
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Last updated: November 2026. How RawQR treats your URLs, uploaded media, and device privacy.
        </p>
      </div>

      <div className="space-y-10 text-gray-700 leading-relaxed text-sm sm:text-base">
        {/* Highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs">
            <EyeOff className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-bold text-gray-900 text-sm">No Tracking Codes</h4>
            <p className="text-xs text-gray-600 mt-1">
              We never wrap your destination URLs with advertising or analytics trackers.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs">
            <Lock className="w-6 h-6 text-emerald-600 mb-2" />
            <h4 className="font-bold text-gray-900 text-sm">Zero Account Needed</h4>
            <p className="text-xs text-gray-600 mt-1">
              You do not need to register, provide credit card numbers, or reveal identity.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs">
            <Server className="w-6 h-6 text-indigo-600 mb-2" />
            <h4 className="font-bold text-gray-900 text-sm">Secure Cloud Storage</h4>
            <p className="text-xs text-gray-600 mt-1">
              Uploaded images are delivered over verified HTTPS connections on enterprise CDNs.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            1. Website URL QR Code Generation
          </h2>
          <p>
            When you enter a website URL into RawQR, the QR code matrix is calculated and rendered directly inside your web browser using client-side vector algorithms. The URL string you submit for a website QR is <strong>never transmitted to any tracking database</strong>, logged in user tracking profiles, or sold to third-party ad networks.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <span>2. Image Uploads and Storage Lifecycle</span>
          </h2>
          <p>
            Standard QR codes have a mathematical data capacity limit of approximately 2,953 bytes in binary mode. Because full-resolution photographs and graphics exceed this capacity, RawQR uploads your image to configured secure cloud storage (such as Cloudinary CDN or Supabase Storage).
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm text-gray-600">
            <li>
              <strong>Public Access:</strong> For smartphone cameras to view your image when scanning the QR code, the resulting uploaded image link must remain publicly accessible via HTTPS.
            </li>
            <li>
              <strong>Sanitization:</strong> All uploaded files undergo binary magic-byte inspection on our backend to ensure they are strictly genuine PNG, JPG, or WebP images and not malicious executables.
            </li>
            <li>
              <strong>Retention:</strong> Images remain available on cloud storage as long as your storage account keeps them active. If you wish to delete an uploaded image, contact support or manage your linked storage bucket.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            3. Local Storage and Cookies
          </h2>
          <p>
            RawQR does not use third-party advertising cookies. We may use your browser's local memory strictly to preserve your selected UI preferences (such as light mode or recent color choices) during your active session.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            4. Security of Generated Files
          </h2>
          <p>
            When you download your QR code as a PNG or SVG, the file is compiled in-memory on your device. RawQR does not save a copy of your downloaded graphics on our servers.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            5. Contact Us Regarding Privacy
          </h2>
          <p>
            If you have questions regarding our data handling or image deletion policies, please email us directly at{' '}
            <a href="mailto:privacy@rawqr.io" className="text-blue-600 hover:underline font-medium">
              privacy@rawqr.io
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};
