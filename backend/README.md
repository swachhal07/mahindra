# Mahindra Nepal — Admin & Catalog API

Node.js + Express + MongoDB Atlas backend that powers the admin portal at `/login → /admin` on the website. Manages the vehicle catalog and blog posts, including their images and brochure PDFs. Files are stored directly inside MongoDB so the server needs no disk and no third-party file host.

> Booking-form emails are handled separately by the Vercel serverless function at `frontend/api/booking.js` and do **not** pass through this server.

## Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Create your `.env`**

   Copy `.env.example` → `.env` and fill in:

   ```env
   PORT=5174

   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/mahindra
   JWT_SECRET=some-long-random-string
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=choose-a-strong-password
   ```

   - `MONGODB_URI` comes from MongoDB Atlas → Database → Connect → Drivers.
   - The admin account is created automatically at startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (password is bcrypt-hashed; changing it in `.env` updates the account on next start).

3. **Seed the original lineup** (one-time, after `MONGODB_URI` is set)

   ```bash
   npm run seed
   ```

   Imports the 9 vehicles and 4 blog posts that used to be hardcoded in the frontend — including photos, feature galleries, brochures and article hero images — so the admin portal can edit or delete all of them. Refuses to run twice; `npm run seed -- --force` wipes the catalog and re-seeds.

## Run

```bash
npm start            # production
npm run dev          # auto-restart on file change (node --watch)
```

You should see:

```
[server] Admin API listening on http://localhost:5174
[server] MongoDB connected.
[server] Admin account created: admin@example.com
```

## API

### `GET /api/health`

Liveness probe — returns `{ "ok": true }`.

### Auth — `POST /api/auth/login`

`{ "email": "...", "password": "..." }` → `{ "ok": true, "token": "<JWT>" }` (7-day expiry).
`GET /api/auth/me` with `Authorization: Bearer <token>` validates a stored token.

### Vehicles

| Method & path              | Auth | Purpose                          |
| -------------------------- | ---- | -------------------------------- |
| `GET /api/vehicles`        | —    | List all vehicles (public site)  |
| `GET /api/vehicles/:id`    | —    | One vehicle                      |
| `POST /api/vehicles`       | ✅   | Create (multipart/form-data)     |
| `PUT /api/vehicles/:id`    | ✅   | Update (multipart/form-data)     |
| `DELETE /api/vehicles/:id` | ✅   | Delete vehicle + unused files    |

### Blog posts

| Method & path          | Auth | Purpose                       |
| ---------------------- | ---- | ----------------------------- |
| `GET /api/blog`        | —    | List all posts (public site)  |
| `GET /api/blog/:id`    | —    | One post                      |
| `POST /api/blog`       | ✅   | Create (multipart/form-data)  |
| `PUT /api/blog/:id`    | ✅   | Update (multipart/form-data)  |
| `DELETE /api/blog/:id` | ✅   | Delete post + unused image    |

### Images / brochures — `GET /api/images/:id`

Serves a stored photo or PDF. Aggressively cached (assets are immutable; edits create new ones).

## Deploying

Set the same env vars on your host (Render, Railway, Fly.io, etc.) and point the frontend at the deployed URL by setting `VITE_API_BASE_URL` in Vercel.
