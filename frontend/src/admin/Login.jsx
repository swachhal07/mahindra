import React, { useState } from 'react';
import { Lock, Mail, LogIn } from 'lucide-react';
import { api, setToken } from '../utils/adminApi';

// Admin login portal, served at /login. Matches the site's dark + red brand.
export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setToken(data.token);
      onLogin(data.email);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse 110% 90% at 90% 20%, rgba(150,35,35,0.45) 0%, rgba(100,20,20,0.28) 25%, rgba(50,10,10,0.15) 50%, rgba(15,3,3,0.05) 75%, rgba(0,0,0,0) 95%), #000',
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-[#e21b22] text-xs font-bold uppercase tracking-[0.35em] mb-4">
            Mahindra Nepal
          </p>
          <h1 className="text-white font-black uppercase tracking-tight text-3xl sm:text-4xl">
            Admin Portal
          </h1>
          <p className="text-neutral-500 text-sm mt-3">
            Sign in to manage the vehicle catalog
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 backdrop-blur"
        >
          {error && (
            <div className="mb-5 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <label className="block mb-5">
            <span className="text-neutral-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block">
              Email
            </span>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-black/60 border border-neutral-700 focus:border-[#e21b22] rounded-lg text-white text-sm pl-10 pr-4 py-3 outline-none transition-colors"
              />
            </div>
          </label>

          <label className="block mb-7">
            <span className="text-neutral-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block">
              Password
            </span>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/60 border border-neutral-700 focus:border-[#e21b22] rounded-lg text-white text-sm pl-10 pr-4 py-3 outline-none transition-colors"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#e21b22] hover:bg-[#c4151b] disabled:opacity-50 text-white font-bold uppercase tracking-wider text-sm px-6 py-3.5 rounded-lg transition-colors"
          >
            <LogIn className="w-4 h-4" />
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-neutral-600 text-xs mt-6">
          <a href="/" className="hover:text-neutral-400 transition-colors">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
