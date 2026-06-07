// Mahindra Nepal — Booking Email API
//
// Standalone Express backend (lives in /backend) that receives booking
// submissions from the React frontend and emails them via Gmail SMTP using
// Nodemailer.
//
// Required env vars (set in `backend/.env` — gitignored, never commit it):
//   GMAIL_USER         e.g. yourname@gmail.com
//   GMAIL_APP_PASSWORD 16-char Google App Password (NOT your Gmail password)
//   BOOKING_TO         where booking notifications are delivered
//                      (defaults to GMAIL_USER if unset)
//   PORT               server port (defaults to 5174)
//
// Run from this folder with:  npm install && npm start
// Or from the project root:   npm run server

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const {
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
  BOOKING_TO,
  PORT = 5174,
} = process.env;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error(
    '[server] Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment. ' +
      'Copy .env.example to .env and fill in your Gmail credentials.'
  );
  process.exit(1);
}

const recipient = BOOKING_TO || GMAIL_USER;

// Nodemailer transport — uses Gmail SMTP over TLS on port 587.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

// Verify credentials at startup so a wrong app password is caught immediately
// rather than when the first booking comes in.
transporter
  .verify()
  .then(() => console.log('[server] Gmail SMTP connection verified.'))
  .catch((err) => {
    console.error('[server] Gmail SMTP verify failed:', err.message);
    console.error(
      '[server] Make sure 2FA is enabled and you used a 16-char App Password ' +
        '(https://myaccount.google.com/apppasswords).'
    );
  });

const app = express();
app.use(cors());
app.use(express.json({ limit: '64kb' }));

// Lightweight HTML-escape for values that go into the email body — prevents
// header injection / HTML injection by the client.
const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

app.post('/api/booking', async (req, res) => {
  const { name, email, phone, model, date, location, consent } = req.body || {};

  // Basic validation — frontend has its own checks too.
  if (!name || !email || !phone || !model || !date) {
    return res
      .status(400)
      .json({ ok: false, error: 'Missing required fields.' });
  }
  if (!consent) {
    return res.status(400).json({
      ok: false,
      error: 'Consent is required before submitting.',
    });
  }

  const subject = `New Test Ride Booking — ${model} (${name})`;

  // Render the submission timestamp for the email body / metadata.
  const submittedAt = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Kathmandu',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // Branded HTML email template. Uses tables + inline styles since most email
  // clients (Gmail, Outlook) strip <style> blocks and don't support flex/grid.
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

          <!-- Brand header bar -->
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

          <!-- Intro line -->
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

          <!-- Booking details card -->
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

          <!-- Quick-action buttons -->
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

          <!-- Footer -->
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

  try {
    await transporter.sendMail({
      from: `"Mahindra Nepal Booking" <${GMAIL_USER}>`,
      to: recipient,
      replyTo: email,
      subject,
      text,
      html,
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[server] sendMail failed:', err);
    return res
      .status(500)
      .json({ ok: false, error: 'Failed to send the booking email.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`[server] Booking API listening on http://localhost:${PORT}`);
  console.log(`[server] Notifications will be sent to: ${recipient}`);
});
