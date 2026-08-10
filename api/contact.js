export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, turnstileToken } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, message' });
  }

  if (!turnstileToken) {
    return res.status(400).json({ error: 'Missing Turnstile token' });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

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
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: 'New contact — Z. Mijailović Portfolio (mdzdravko.com)',
        _template: 'table',
        _replyto: email,
      }),
    });

    const text = await formRes.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      /* FormSubmit may return non-JSON */
    }

    if (!formRes.ok) {
      const msg = data?.message || data?.error || text || formRes.statusText;
      console.error('FormSubmit error:', formRes.status, msg);
      return res.status(502).json({ error: msg || 'Failed to send message' });
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
