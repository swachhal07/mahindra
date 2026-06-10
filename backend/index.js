// Mahindra Nepal — Admin & Catalog API
//
// Express + MongoDB Atlas backend that powers the admin portal at
// /login → /admin on the website. Manages the vehicle catalog and blog
// posts, including their images and brochure PDFs (stored directly in
// MongoDB so the server needs no disk).
//
// Booking emails are handled separately by the Vercel serverless function
// at frontend/api/booking.js — that flow does NOT pass through this server.
//
// Required env vars (set in `backend/.env` — gitignored, never commit it):
//   MONGODB_URI     MongoDB Atlas connection string
//   JWT_SECRET      random string used to sign admin login tokens
//   ADMIN_EMAIL     login email for the /login portal
//   ADMIN_PASSWORD  login password (hashed on first startup, never stored raw)
//   PORT            server port (defaults to 5174)
//
// Run from this folder with:  npm install && npm start

import 'dotenv/config';
import dns from 'node:dns';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import authRouter from './routes/auth.js';
import vehiclesRouter from './routes/vehicles.js';
import blogRouter from './routes/blog.js';
import imagesRouter from './routes/images.js';

// Some home ISPs (especially in Nepal) run DNS servers that don't return
// SRV records, which breaks `mongodb+srv://` URIs with ECONNREFUSED. Force
// this Node process to use Google + Cloudflare DNS so the backend works
// regardless of the host's DNS configuration. Affects only this process,
// not the rest of the system.
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const { MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, PORT = 5174 } = process.env;

if (!MONGODB_URI || !JWT_SECRET) {
  console.error(
    '[server] Missing MONGODB_URI or JWT_SECRET. Copy .env.example to .env and fill them in.'
  );
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('[server] MongoDB connected.');
    await ensureAdminUser();
  })
  .catch((err) => {
    console.error('[server] MongoDB connection failed:', err.message);
  });

// Create the admin account from env vars on first run (no public signup).
// If the account exists, the password is synced to ADMIN_PASSWORD so the
// .env file stays the single source of truth for credentials.
async function ensureAdminUser() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('[server] ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin login available.');
    return;
  }
  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existing = await Admin.findOne({ email });
  if (existing) {
    if (!(await bcrypt.compare(ADMIN_PASSWORD, existing.passwordHash))) {
      existing.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await existing.save();
      console.log(`[server] Admin password updated from .env for ${email}.`);
    }
    return;
  }
  await Admin.create({ email, passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10) });
  console.log(`[server] Admin account created: ${email}`);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '64kb' }));

// Guard against requests hanging on Mongoose buffering when the DB is still
// connecting (or has dropped). Returns 503 instead.
function requireDb(_req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ ok: false, error: 'Database is not available.' });
  }
  return next();
}

app.use('/api/auth', requireDb, authRouter);
app.use('/api/vehicles', requireDb, vehiclesRouter);
app.use('/api/blog', requireDb, blogRouter);
app.use('/api/images', requireDb, imagesRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`[server] Admin API listening on http://localhost:${PORT}`);
});
