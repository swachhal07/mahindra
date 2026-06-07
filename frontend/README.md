# Mahindra Nepal — Frontend

React + Vite + Tailwind CSS frontend for the Mahindra Nepal website.

## Local development

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

The booking form POSTs to `/api/booking`. In dev, Vite proxies this to the backend on `http://localhost:5174` (configured in `vite.config.js`). Run the backend in another terminal:

```bash
cd ../backend
npm install
npm start
```

Or run both at once from the repo root:

```bash
npm run dev:all
```

## Environment variables

Copy `.env.example` to `.env.local` for local overrides. Variables:

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Origin of the deployed backend (used by the booking form). Leave empty for local dev (Vite proxy handles it). Set it to your hosted backend URL in production. |

## Build

```bash
npm run build        # output goes to dist/
npm run preview      # serve the production build locally
```

## Deploying to Vercel

1. Push the repo to GitHub (already done).
2. In Vercel, **Add New Project** → import this repo.
3. **Important settings:**
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
   - **Install Command**: `npm install` (default)
4. **Environment Variables** (in Vercel project settings → Environment Variables):
   - `VITE_API_BASE_URL` = your deployed backend URL, e.g. `https://mahindra-api.onrender.com`
5. Deploy.

### Backend hosting

The Express backend in `/backend` is NOT deployed by Vercel — it has to live somewhere else. Recommended hosts (all have free tiers):

- **Render** (https://render.com) — easiest, just point at the `backend` folder
- **Railway** (https://railway.app)
- **Fly.io** (https://fly.io)

When you deploy the backend, set the same env vars there:

```
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
BOOKING_TO=...
PORT=5174     # most hosts auto-assign, but keep this as fallback
```

Then put that host's URL into Vercel's `VITE_API_BASE_URL` and redeploy the frontend. Bookings will flow end-to-end.
