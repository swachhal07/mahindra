import jwt from 'jsonwebtoken';

// Protects admin-only routes. Expects `Authorization: Bearer <token>` where
// the token was issued by POST /api/auth/login.
export default function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ ok: false, error: 'Not authenticated.' });
  }
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Session expired. Please log in again.' });
  }
}
