import { ValidationResult } from '../types/qr';

/**
 * Validates whether a given string is a valid HTTP or HTTPS URL.
 * Will not silently accept arbitrary non-URL text.
 */
export function validateUrl(rawUrl: string): ValidationResult {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a URL (e.g. https://example.com)',
    };
  }

  // Check if user forgot protocol
  if (!/^https?:\/\//i.test(trimmed)) {
    // If it looks like a domain name, offer guidance
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(trimmed)) {
      return {
        isValid: false,
        error: 'URL must start with http:// or https:// (e.g. https://' + trimmed + ')',
      };
    }
    return {
      isValid: false,
      error: 'Please enter a valid website URL starting with https:// or http://',
    };
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'Only HTTP and HTTPS URLs are supported.',
      };
    }

    if (!parsed.hostname || parsed.hostname.length < 3) {
      return {
        isValid: false,
        error: 'The domain name is missing or invalid.',
      };
    }

    // Must have at least one dot or be localhost
    if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return {
        isValid: false,
        error: 'Please enter a valid domain name (e.g. example.com).',
      };
    }

    return {
      isValid: true,
      sanitizedValue: parsed.href,
    };
  } catch {
    return {
      isValid: false,
      error: 'Malformed URL. Please check the address and try again.',
    };
  }
}
