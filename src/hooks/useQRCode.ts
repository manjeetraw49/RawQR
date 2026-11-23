import { useState, useEffect, useRef, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRDesignConfig, QRContentType } from '../types/qr';
import { createQRCodeInstance, buildQRCodeStylingOptions } from '../services/qrService';
import { downloadQR } from '../utils/downloadQR';

export const DEFAULT_DESIGN_CONFIG: QRDesignConfig = {
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  errorCorrection: 'H',
  logoUrl: null,
  logoSize: 0.28,
  dotsType: 'rounded',
  cornersSquareType: 'extra-rounded',
  cornersDotType: 'dot',
};

export function useQRCode() {
  const [data, setData] = useState<string>('');
  const [designConfig, setDesignConfig] = useState<QRDesignConfig>(DEFAULT_DESIGN_CONFIG);
  const [contentType, setContentType] = useState<QRContentType>('url');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  // Initialize or update QR Code instance
  useEffect(() => {
    if (!containerRef.current) return;

    if (!qrCodeRef.current) {
      // First mount: instantiate and append
      const qr = createQRCodeInstance({
        data: data || 'https://rawqr.io',
        config: designConfig,
        width: 320,
        height: 320,
      });
      qrCodeRef.current = qr;
      containerRef.current.innerHTML = '';
      qr.append(containerRef.current);
    } else {
      // Update existing instance
      const options = buildQRCodeStylingOptions({
        data: data || 'https://rawqr.io',
        config: designConfig,
        width: 320,
        height: 320,
      });
      qrCodeRef.current.update(options);
    }
  }, [data, designConfig]);

  const updateDesign = useCallback((partial: Partial<QRDesignConfig>) => {
    setDesignConfig((prev) => ({
      ...prev,
      ...partial,
      // If adding a logo, automatically set error correction to 'H' for readability
      ...(partial.logoUrl ? { errorCorrection: 'H' } : {}),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setData('');
    setDesignConfig(DEFAULT_DESIGN_CONFIG);
  }, []);

  const handleDownload = useCallback(
    async (format: 'png' | 'svg') => {
      if (!qrCodeRef.current || !data) return;
      setIsExporting(true);
      try {
        await downloadQR({
          qrCode: qrCodeRef.current,
          format,
          contentType,
        });
      } finally {
        setIsExporting(false);
      }
    },
    [data, contentType]
  );

  return {
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
    hasValidData: Boolean(data && data.trim().length > 0),
  };
}
