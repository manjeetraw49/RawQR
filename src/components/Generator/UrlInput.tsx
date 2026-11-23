import React, { useState, useEffect } from 'react';
import { Link2, AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { validateUrl } from '../../utils/validateUrl';

interface UrlInputProps {
  initialUrl?: string;
  onGenerate: (validUrl: string) => void;
  onClear: () => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  initialUrl = '',
  onGenerate,
  onClear,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsTouched(true);

    const validation = validateUrl(url);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid website URL.');
      return;
    }

    setError(null);
    onGenerate(validation.sanitizedValue || url.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    if (error) {
      setError(null);
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
    setIsTouched(false);
    onClear();
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="website-url-input"
          className="block text-sm font-semibold text-gray-800 mb-1.5"
        >
          Website Destination URL
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Enter any public website, landing page, portfolio, or profile link.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Link2 className="w-5 h-5" />
            </div>

            <input
              type="text"
              id="website-url-input"
              value={url}
              onChange={handleInputChange}
              onBlur={() => {
                if (url.trim()) {
                  setIsTouched(true);
                  const v = validateUrl(url);
                  if (!v.isValid) setError(v.error || 'Invalid URL');
                }
              }}
              placeholder="https://example.com"
              className={`block w-full pl-11 pr-20 py-3 text-sm rounded-xl border bg-white text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />

            {url && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-2 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear input"
                aria-label="Clear URL"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Validation error message */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 mt-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Helper or quick validation confirmation */}
          {!error && isTouched && url.trim() && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Valid URL format</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline">
              Format: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">https://yourdomain.com</code>
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm hover:shadow"
            >
              <span>Generate QR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
