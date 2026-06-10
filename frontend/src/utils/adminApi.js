// Shared helpers for talking to the Express backend (vehicle catalog +
// admin auth). In dev, Vite proxies /api/* to localhost:5174; in production
// set VITE_API_BASE_URL to the deployed backend origin (same convention the
// booking form already uses).
export const apiBase = import.meta.env.VITE_API_BASE_URL || '';

const TOKEN_KEY = 'mahindra_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Turn a backend-relative URL (e.g. /api/images/abc123) into an absolute one.
export const assetUrl = (url) => (url ? `${apiBase}${url}` : null);

// fetch wrapper: prefixes the API base, attaches the admin token, and
// normalises errors into thrown Error objects with a readable message.
export async function api(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
  const opts = { method, headers: { ...headers } };
  if (auth) {
    const token = getToken();
    if (token) opts.headers.Authorization = `Bearer ${token}`;
  }
  if (body instanceof FormData) {
    opts.body = body; // browser sets the multipart boundary itself
  } else if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  const resp = await fetch(`${apiBase}${path}`, opts);
  let data = null;
  try {
    data = await resp.json();
  } catch {
    /* non-JSON response body */
  }
  if (!resp.ok || data?.ok === false) {
    const err = new Error(data?.error || `Request failed (${resp.status})`);
    err.status = resp.status;
    throw err;
  }
  return data;
}
