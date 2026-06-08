// Vercel serverless function — /api/booking
//
// Same logic as backend/index.js, but runs on Vercel's Node runtime so we
// don't need a separate Render/Railway service. The frontend calls
// fetch('/api/booking', ...) same-origin and Vercel routes here automatically.
//
// Required env vars (set in Vercel project → Settings → Environment Variables):
//   GMAIL_USER         e.g. yourname@gmail.com
//   GMAIL_APP_PASSWORD 16-char Google App Password
//   BOOKING_TO         where booking notifications go (defaults to GMAIL_USER)

import nodemailer from 'nodemailer';

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, BOOKING_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return res
      .status(500)
      .json({ ok: false, error: 'Email service is not configured.' });
  }
  const recipient = BOOKING_TO || GMAIL_USER;

  const { name, email, phone, model, date, location, consent } = req.body || {};

  if (!name || !email || !phone || !model || !date) {
    return res
      .status(400)
      .json({ ok: false, error: 'Missing required fields.' });
  }
  if (!consent) {
    return res
      .status(400)
      .json({ ok: false, error: 'Consent is required before submitting.' });
  }

  const subject = `New Test Ride Booking — ${model} (${name})`;
  const submittedAt = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Kathmandu',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#dd052c 0%,#a30420 100%);padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;opacity:0.85;">Mahindra Nepal</div>
                    <div style="color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.3px;margin-top:6px;">New Test Ride Booking</div>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <div style="display:inline-block;background:rgba(255,255,255,0.15);color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 12px;border-radius:999px;">New Lead</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <p style="margin:0;color:#1a1a1a;font-size:16px;line-height:1.5;">
                <strong style="color:#000;">${esc(name)}</strong> has just requested a test ride on
                <strong style="color:#dd052c;">${esc(model)}</strong>.
              </p>
              <p style="margin:8px 0 0 0;color:#666;font-size:13px;line-height:1.5;">
                Please follow up to confirm the schedule.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #ececec;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #ececec;">
                    <div style="color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Customer Name</div>
                    <div style="color:#1a1a1a;font-size:16px;font-weight:600;">${esc(name)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #ececec;">
                    <div style="color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Email</div>
                    <a href="mailto:${esc(email)}" style="color:#dd052c;font-size:15px;font-weight:500;text-decoration:none;">${esc(email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #ececec;">
                    <div style="color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Phone</div>
                    <a href="tel:${esc(phone)}" style="color:#dd052c;font-size:15px;font-weight:500;text-decoration:none;">${esc(phone)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #ececec;">
                    <div style="color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Vehicle of Interest</div>
                    <div style="color:#1a1a1a;font-size:15px;font-weight:600;">${esc(model)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #ececec;">
                    <div style="color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Preferred Date</div>
                    <div style="color:#1a1a1a;font-size:15px;font-weight:600;">${esc(date)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Showroom Location</div>
                    <div style="color:#1a1a1a;font-size:15px;font-weight:500;">${esc(location)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:8px;">
                    <a href="tel:${esc(phone)}" style="display:inline-block;background:#dd052c;color:#ffffff;font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:12px 22px;border-radius:8px;text-decoration:none;">Call Customer</a>
                  </td>
                  <td style="padding-left:8px;">
                    <a href="mailto:${esc(email)}" style="display:inline-block;background:#1a1a1a;color:#ffffff;font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:12px 22px;border-radius:8px;text-decoration:none;">Reply by Email</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#fafafa;border-top:1px solid #ececec;padding:18px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="color:#888;font-size:11px;line-height:1.5;">
                      Submitted ${esc(submittedAt)} (Asia/Kathmandu)<br />
                      via the Mahindra Nepal website booking form
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <div style="color:#dd052c;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Rise.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div style="margin-top:14px;color:#999;font-size:11px;">
          You are receiving this email because the booking form is configured to deliver leads to this address.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `New Test Ride Booking`,
    ``,
    `Name:           ${name}`,
    `Email:          ${email}`,
    `Phone:          ${phone}`,
    `Vehicle:        ${model}`,
    `Preferred Date: ${date}`,
    `Location:       ${location}`,
  ].join('\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Mahindra Nepal Booking" <${GMAIL_USER}>`,
      to: recipient,
      replyTo: email,
      subject,
      text,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/booking] sendMail failed:', err);
    return res
      .status(500)
      .json({ ok: false, error: 'Failed to send the booking email.' });
  }
}
