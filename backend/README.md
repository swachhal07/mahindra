# Mahindra Nepal — Booking Email API

Standalone Node.js + Express backend that receives test-ride booking submissions from the website and emails them to the dealership inbox via Gmail SMTP.

## Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Create your `.env`**

   Copy `.env.example` → `.env` and fill in:

   ```env
   GMAIL_USER=yourname@gmail.com
   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
   BOOKING_TO=yourname@gmail.com
   PORT=5174
   ```

   - `GMAIL_APP_PASSWORD` must be a **16-character Google App Password** (not your normal Gmail password).
   - Generate one at https://myaccount.google.com/apppasswords. 2-Step Verification must be enabled on the account.
   - `BOOKING_TO` is where the booking notifications land — usually the same as `GMAIL_USER`.

## Run

```bash
npm start            # production
npm run dev          # auto-restart on file change (node --watch)
```

You should see:

```
[server] Booking API listening on http://localhost:5174
[server] Notifications will be sent to: yourname@gmail.com
[server] Gmail SMTP connection verified.
```

## API

### `POST /api/booking`

Request body (JSON):

```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+977 98XXXXXXXX",
  "model": "BlazoX 35 Truck",
  "date": "2026-06-15",
  "location": "M.V Dugar Building, Kathmandu",
  "consent": true
}
```

Response:

- `200 { "ok": true }` — email sent
- `400 { "ok": false, "error": "..." }` — missing fields / consent
- `500 { "ok": false, "error": "..." }` — SMTP failure

### `GET /api/health`

Simple liveness probe — returns `{ "ok": true }`.

## Deploying

Set the same env vars on your host (Render, Railway, Fly.io, etc.) and point the frontend at the deployed URL (or proxy `/api/*` to it through the same domain).
