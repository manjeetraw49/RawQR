import type { VercelRequest, VercelResponse } from '@vercel/node';

const TARGET_EMAIL = process.env.CONTACT_EMAIL || 'mk7366175@gmail.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (name, email, message).',
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    // Forward to FormSubmit to deliver directly to Gmail
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TARGET_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: req.headers.origin || 'https://rawqr.vercel.app',
        Referer: req.headers.referer || 'https://rawqr.vercel.app/',
      },
      body: JSON.stringify({
        name,
        email,
        _replyto: email,
        _subject: `[RawQR Note] ${subject || 'New Note Received'}`,
        message,
        _template: 'table',
      }),
    });

    const data = (await response.json()) as any;

    // Check if FormSubmit returned an activation notice or success
    if (data?.success === 'true' || data?.success === true) {
      return res.status(200).json({
        success: true,
        message: 'Your note has been delivered successfully!',
      });
    }

    // If form needs initial 1-time activation
    if (data?.message && data.message.includes('Activation')) {
      return res.status(200).json({
        success: true,
        activationNeeded: true,
        message: data.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Your message has been processed successfully.',
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send note. Please try again later.',
    });
  }
}
