import mongoose from 'mongoose';

// Admin users who can log in at /login on the website and manage vehicles.
// Created automatically at server startup from ADMIN_EMAIL / ADMIN_PASSWORD
// env vars (see ensureAdminUser in index.js) — there is no public signup.
const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
