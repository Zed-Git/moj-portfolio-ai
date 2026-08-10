function parseJsonBody(body) {
  if (!body) return {};
  if (typeof body === 'object') return body;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return {};
}

function formSubmitSucceeded(data) {
  if (!data || typeof data !== 'object') return false;
  return data.success === true || data.success === 'true';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, turnstileToken } = parseJsonBody(req.body);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, message' });
  }

  if (!turnstileToken) {
    return res.status(400).json({ error: 'Missing Turnstile token' });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const isDev =
    process.env.VERCEL_ENV === 'development' || process.env.NODE_ENV === 'development';

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: turnstileToken,
      }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return res.status(403).json({
        error: 'Turnstile verification failed',
        codes: verifyData['error-codes'],
      });
    }

    const formSubmitId = (
      process.env.VITE_FORMSUBMIT_ID ||
      process.env.FORMSUBMIT_ID ||
      '9ef527932da0d9ce7f458f4a9e74ec93'
    ).trim();

    const formRes = await fetch(`https://formsubmit.co/ajax/${formSubmitId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'mdzdravko-portfolio-contact/1.0',
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: 'New contact — Z. Mijailović Portfolio (mdzdravko.com)',
        _template: 'table',
        _replyto: email,
        // Server-side submit already verified by Turnstile; skip FormSubmit reCAPTCHA page.
        _captcha: 'false',
      }),
    });

    const text = await formRes.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      /* FormSubmit may return non-JSON (e.g. captcha HTML) */
    }

    if (!formRes.ok || !formSubmitSucceeded(data)) {
      const msg =
        data?.message ||
        data?.error ||
        (text && !text.startsWith('<') ? text.slice(0, 300) : null) ||
        formRes.statusText;
      console.error('FormSubmit error:', formRes.status, msg, text?.slice(0, 500));
      return res.status(502).json({
        error: msg || 'Failed to send message',
        ...(isDev && {
          details: {
            status: formRes.status,
            success: data?.success,
            bodyPreview: text?.slice(0, 500),
          },
        }),
      });
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({
      error: 'Internal server error',
      ...(isDev && { details: err.message }),
    });
  }
}
