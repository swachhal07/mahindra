import { Router } from 'express';
import mongoose from 'mongoose';
import Branch from '../models/Branch.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

function serialize(b) {
  return {
    id: b._id,
    city: b.city,
    district: b.district,
    province: b.province,
    phone: b.phone,
    lng: b.lng,
    lat: b.lat,
    order: b.order,
    updatedAt: b.updatedAt,
  };
}

// Parse and validate the writable fields shared by create and update.
// Returns { city, district, province, phone, lng, lat, order } or throws.
function readFields(body, { partial = false } = {}) {
  const out = {};

  if (body.city != null || !partial) {
    const city = String(body.city ?? '').trim();
    if (!city) throw Object.assign(new Error('City is required.'), { status: 400 });
    out.city = city;
  }
  if (body.district != null) out.district = String(body.district).trim();
  if (body.province != null) out.province = String(body.province).trim();
  if (body.phone != null) out.phone = String(body.phone).trim();

  for (const key of ['lng', 'lat']) {
    if (body[key] == null && partial) continue;
    const value = Number(body[key]);
    if (!Number.isFinite(value)) {
      throw Object.assign(new Error(`${key} must be a number.`), { status: 400 });
    }
    const limit = key === 'lng' ? 180 : 90;
    if (value < -limit || value > limit) {
      throw Object.assign(new Error(`${key} is out of range.`), { status: 400 });
    }
    out[key] = value;
  }

  if (body.order != null) {
    const order = Number(body.order);
    out.order = Number.isFinite(order) ? order : 0;
  }

  return out;
}

// ── Google Maps link → coordinates ──
//
// Long Maps URLs carry the coordinates in the path, so the admin form parses
// those in the browser. Short links (maps.app.goo.gl / goo.gl) only reveal
// them after following the redirect, which the browser cannot do
// cross-origin — hence this endpoint.
//
// Only Google Maps hosts are followed, and every redirect hop is re-checked,
// so this cannot be pointed at an internal address.
const MAPS_HOSTS = new Set([
  'google.com',
  'www.google.com',
  'maps.google.com',
  'goo.gl',
  'maps.app.goo.gl',
]);

function isAllowedMapsUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  // Country domains such as google.com.np / google.co.in.
  const host = url.hostname.toLowerCase();
  const allowed = MAPS_HOSTS.has(host) || /^(www\.|maps\.)?google\.[a-z.]{2,7}$/.test(host);
  return allowed ? url : null;
}

// Pull "lat,lng" out of the shapes Google uses: /@lat,lng,17z ,
// !3dlat!4dlng (inside the data= blob), and ?q=lat,lng / ?ll=lat,lng.
function extractLatLng(text) {
  if (!text) return null;
  const patterns = [
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /[/@](-?\d+\.\d+),\s*(-?\d+\.\d+)/,
    /[?&](?:q|ll|center|daddr|sll)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng };
    }
  }
  return null;
}

router.post('/resolve-link', requireAuth, async (req, res) => {
  const raw = String(req.body?.url ?? '').trim();
  if (!raw) return res.status(400).json({ ok: false, error: 'Paste a Google Maps link first.' });

  let url = isAllowedMapsUrl(raw);
  if (!url) {
    return res
      .status(400)
      .json({ ok: false, error: 'That is not a Google Maps link. Copy the link from Google Maps and try again.' });
  }

  // The coordinates may already be in the pasted URL.
  const direct = extractLatLng(raw);
  if (direct) return res.json({ ok: true, ...direct, source: 'url' });

  try {
    // Follow up to 5 redirects by hand so each hop can be host-checked.
    let body = '';
    for (let hop = 0; hop < 5; hop += 1) {
      const resp = await fetch(url.toString(), {
        redirect: 'manual',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MahindraAdmin/1.0)' },
        signal: AbortSignal.timeout(8000),
      });

      const location = resp.headers.get('location');
      if (resp.status >= 300 && resp.status < 400 && location) {
        const next = isAllowedMapsUrl(new URL(location, url).toString());
        if (!next) {
          return res.status(400).json({ ok: false, error: 'The link redirected somewhere unexpected.' });
        }
        const fromRedirect = extractLatLng(next.toString());
        if (fromRedirect) return res.json({ ok: true, ...fromRedirect, source: 'redirect' });
        url = next;
        continue;
      }

      body = await resp.text();
      break;
    }

    const found = extractLatLng(url.toString()) || extractLatLng(body);
    if (!found) {
      return res.status(422).json({
        ok: false,
        error: 'Could not read coordinates from that link. Right-click the spot in Google Maps and copy the numbers instead.',
      });
    }
    return res.json({ ok: true, ...found, source: 'page' });
  } catch (err) {
    console.error('[branches] resolve-link failed:', err.message);
    return res.status(502).json({ ok: false, error: 'Could not reach Google Maps to read that link.' });
  }
});

// ── Public read ──

router.get('/', async (_req, res) => {
  const branches = await Branch.find().sort({ order: 1, city: 1 });
  res.json({ ok: true, branches: branches.map(serialize) });
});

// ── Admin writes ──

router.post('/', requireAuth, async (req, res) => {
  try {
    const branch = await Branch.create(readFields(req.body));
    return res.status(201).json({ ok: true, branch: serialize(branch) });
  } catch (err) {
    const status = err.status || 500;
    console.error('[branches] create failed:', err.message);
    return res
      .status(status)
      .json({ ok: false, error: err.status ? err.message : 'Failed to create the branch.' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Branch not found.' });
  }
  const branch = await Branch.findById(req.params.id);
  if (!branch) return res.status(404).json({ ok: false, error: 'Branch not found.' });

  try {
    Object.assign(branch, readFields(req.body, { partial: true }));
    await branch.save();
    return res.json({ ok: true, branch: serialize(branch) });
  } catch (err) {
    const status = err.status || 500;
    console.error('[branches] update failed:', err.message);
    return res
      .status(status)
      .json({ ok: false, error: err.status ? err.message : 'Failed to update the branch.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Branch not found.' });
  }
  const branch = await Branch.findById(req.params.id);
  if (!branch) return res.status(404).json({ ok: false, error: 'Branch not found.' });

  await branch.deleteOne();
  return res.json({ ok: true });
});

export default router;
