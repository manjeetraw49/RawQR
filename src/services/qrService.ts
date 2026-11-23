import QRCodeStyling, {
  Options,
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel as QRErrorLevel,
} from 'qr-code-styling';
import { QRDesignConfig } from '../types/qr';

export interface CreateQROptions {
  data: string;
  config: QRDesignConfig;
  width?: number;
  height?: number;
}

export function buildQRCodeStylingOptions({
  data,
  config,
  width = 300,
  height = 300,
}: CreateQROptions): Options {
  // If a logo is present, default error correction should be 'H' to preserve readability
  const effectiveErrorCorrection: QRErrorLevel = (
    config.logoUrl ? 'H' : (config.errorCorrection || 'H')
  ) as QRErrorLevel;

  return {
    width,
    height,
    type: 'canvas',
    data: data || 'https://rawqr.io',
    image: config.logoUrl || undefined,
    margin: 8,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: effectiveErrorCorrection,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: config.logoSize || 0.28,
      margin: 4,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: config.foregroundColor || '#000000',
      type: (config.dotsType || 'rounded') as DotType,
    },
    backgroundOptions: {
      color: config.backgroundColor || '#ffffff',
    },
    cornersSquareOptions: {
      color: config.foregroundColor || '#000000',
      type: (config.cornersSquareType || 'extra-rounded') as CornerSquareType,
    },
    cornersDotOptions: {
      color: config.foregroundColor || '#000000',
      type: (config.cornersDotType || 'dot') as CornerDotType,
    },
  };
}

export function createQRCodeInstance(options: CreateQROptions): QRCodeStyling {
  const stylingOptions = buildQRCodeStylingOptions(options);
  return new QRCodeStyling(stylingOptions);
}
