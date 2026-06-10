import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login — exchange email + password for a JWT (7-day expiry).
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Email and password are required.' });
  }

  const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
  // Same error for unknown email and wrong password — don't leak which.
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return res.json({ ok: true, token, email: admin.email });
});

// GET /api/auth/me — lets the admin UI validate a stored token on load.
router.get('/me', requireAuth, (req, res) => {
  res.json({ ok: true, email: req.admin.email });
});

export default router;
