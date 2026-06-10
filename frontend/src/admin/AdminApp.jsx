import React, { useEffect, useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { api, getToken, clearToken } from '../utils/adminApi';

// Admin portal root — rendered instead of the public site when the URL is
// /login or /admin (see main.jsx). Holds the auth session: a JWT in
// localStorage, validated against the backend on load.
export default function AdminApp() {
  // 'checking' → spinner, null → login form, string → logged-in admin email
  const [adminEmail, setAdminEmail] = useState(getToken() ? 'checking' : null);

  useEffect(() => {
    if (!getToken()) return;
    api('/api/auth/me', { auth: true })
      .then((d) => setAdminEmail(d.email))
      .catch(() => {
        clearToken();
        setAdminEmail(null);
      });
  }, []);

  const handleLogin = (email) => {
    setAdminEmail(email);
    // Land on /admin after logging in at /login (no router — just the URL).
    if (window.location.pathname !== '/admin') {
      window.history.replaceState(null, '', '/admin');
    }
  };

  const handleLogout = () => {
    clearToken();
    setAdminEmail(null);
    window.history.replaceState(null, '', '/login');
  };

  if (adminEmail === 'checking') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e21b22] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.25em]">Loading…</span>
        </div>
      </div>
    );
  }

  return adminEmail ? (
    <Dashboard adminEmail={adminEmail} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
