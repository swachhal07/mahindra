import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, ExternalLink, Link2, CheckCircle2 } from 'lucide-react';
import { api } from '../utils/adminApi';

// Long Google Maps URLs carry the coordinates in the path, so they can be read
// without a network call. Short maps.app.goo.gl links do not — those go to the
// backend, which follows the redirect.
function coordsFromMapsUrl(text) {
  const patterns = [
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /[/@](-?\d+\.\d+),\s*(-?\d+\.\d+)/,
    /[?&](?:q|ll|center|daddr|sll)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
    /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/,
  ];
  for (const re of patterns) {
    const m = String(text).match(re);
    if (!m) continue;
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng };
    }
  }
  return null;
}

const inputCls =
  'w-full bg-black/60 border border-neutral-700 focus:border-[#e31837] rounded-lg text-white text-sm px-3.5 py-2.5 outline-none transition-colors';
const labelCls =
  'text-neutral-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block';

// Provinces used by the filter buttons on the public Service Network section.
// Free text is still allowed; this list is only a convenience.
const PROVINCES = [
  'Bagmati',
  'Madesh',
  'Lumbini',
  'Koshi',
  'Sudur Paschim',
  'Gandaki',
  'Karnali',
];

// Branch add/edit form. `branch` is null for "add new", or the serialized
// branch from the API for editing.
export default function BranchForm({ branch, onDone }) {
  const isEdit = Boolean(branch);

  const [city, setCity] = useState(branch?.city ?? '');
  const [district, setDistrict] = useState(branch?.district ?? '');
  const [province, setProvince] = useState(branch?.province ?? '');
  const [phone, setPhone] = useState(branch?.phone ?? '');
  const [lat, setLat] = useState(branch?.lat != null ? String(branch.lat) : '');
  const [lng, setLng] = useState(branch?.lng != null ? String(branch.lng) : '');
  const [order, setOrder] = useState(branch?.order != null ? String(branch.order) : '0');

  const [mapsLink, setMapsLink] = useState('');
  const [linkStatus, setLinkStatus] = useState(null); // {type:'ok'|'error', message}
  const [resolving, setResolving] = useState(false);

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const applyCoords = ({ lat: la, lng: ln }, message) => {
    setLat(String(la));
    setLng(String(ln));
    setLinkStatus({ type: 'ok', message });
  };

  // Read the link: parse it here if the coordinates are in the URL, otherwise
  // ask the backend to follow the short-link redirect.
  const useLink = async (value) => {
    const text = (value ?? mapsLink).trim();
    if (!text) return;

    const local = coordsFromMapsUrl(text);
    if (local) {
      applyCoords(local, 'Coordinates read from the link.');
      return;
    }

    setResolving(true);
    setLinkStatus(null);
    try {
      const data = await api('/api/branches/resolve-link', {
        method: 'POST',
        body: { url: text },
        auth: true,
      });
      applyCoords(data, 'Coordinates read from the shortened link.');
    } catch (err) {
      setLinkStatus({ type: 'error', message: err.message });
    } finally {
      setResolving(false);
    }
  };

  // Accepts "27.7172, 85.3240" pasted straight from Google Maps and splits it
  // across the two fields, since that is how coordinates are usually copied.
  const onLatPaste = (e) => {
    const text = e.clipboardData.getData('text');
    const match = text.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (!match) return;
    e.preventDefault();
    setLat(match[1]);
    setLng(match[2]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!city.trim()) return setError('City is required.');
    if (!Number.isFinite(Number(lat)) || lat === '') return setError('Latitude must be a number.');
    if (!Number.isFinite(Number(lng)) || lng === '') return setError('Longitude must be a number.');

    setBusy(true);
    try {
      await api(isEdit ? `/api/branches/${branch.id}` : '/api/branches', {
        method: isEdit ? 'PUT' : 'POST',
        body: {
          city: city.trim(),
          district: district.trim(),
          province: province.trim(),
          phone: phone.trim(),
          lat: Number(lat),
          lng: Number(lng),
          order: Number(order) || 0,
        },
        auth: true,
      });
      onDone(true);
    } catch (err) {
      setError(err.message);
      setBusy(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    // Rendered inside the dashboard shell, which already provides the page
    // background and its own sticky header — so this one must not be sticky.
    <div className="text-white">
      <div className="border-b border-neutral-800 pb-4 mb-8 flex items-center gap-4">
        <button
          onClick={() => onDone(false)}
          className="text-neutral-400 hover:text-white transition-colors"
          title="Back to branches"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-black uppercase tracking-tight text-lg">
          {isEdit ? `Edit: ${branch.city}` : 'Add Branch'}
        </h1>
      </div>

      <form onSubmit={submit} className="max-w-3xl space-y-8">
        {error && (
          <div className="flex items-start gap-3 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5">
          <h2 className="font-black uppercase tracking-wider text-sm text-[#e31837]">Branch</h2>

          <div>
            <label className={labelCls}>City *</label>
            <input
              className={inputCls}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Pokhara"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>District</label>
              <input
                className={inputCls}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Kaski"
              />
            </div>
            <div>
              <label className={labelCls}>Province</label>
              <input
                className={inputCls}
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="e.g. Gandaki"
                list="branch-provinces"
              />
              <datalist id="branch-provinces">
                {PROVINCES.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
              <p className="text-neutral-600 text-[11px] mt-2">
                Branches are grouped by province in the filter buttons on the public page.
              </p>
            </div>
          </div>

          <div>
            <label className={labelCls}>Phone</label>
            <input
              className={inputCls}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9802748575"
            />
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-black uppercase tracking-wider text-sm text-[#e31837]">
              Map position
            </h2>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              Google Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <label className={labelCls}>Google Maps link</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Link2 className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  className={`${inputCls} pl-10`}
                  value={mapsLink}
                  onChange={(e) => {
                    setMapsLink(e.target.value);
                    setLinkStatus(null);
                  }}
                  onPaste={(e) => {
                    // Fill the coordinates straight away on paste.
                    const text = e.clipboardData.getData('text');
                    if (!text) return;
                    e.preventDefault();
                    setMapsLink(text);
                    setLinkStatus(null);
                    useLink(text);
                  }}
                  placeholder="Paste a maps.app.goo.gl or google.com/maps link"
                />
              </div>
              <button
                type="button"
                onClick={() => useLink()}
                disabled={resolving || !mapsLink.trim()}
                className="shrink-0 text-xs font-bold uppercase tracking-wider text-neutral-200 border border-neutral-700 hover:border-neutral-500 disabled:opacity-40 rounded-lg px-5 py-2.5 transition-colors"
              >
                {resolving ? 'Reading…' : 'Use link'}
              </button>
            </div>

            {linkStatus && (
              <p
                className={`text-xs mt-2 inline-flex items-start gap-1.5 ${
                  linkStatus.type === 'ok' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {linkStatus.type === 'ok' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                )}
                {linkStatus.message}
              </p>
            )}

            <p className="text-neutral-500 text-xs leading-relaxed mt-3">
              In Google Maps, open the branch, press <strong className="text-neutral-300">Share</strong>,
              and copy the link — then paste it above and the coordinates fill in. You can also
              right-click the spot in Google Maps, copy the numbers, and paste them into Latitude.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Latitude *</label>
              <input
                className={inputCls}
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                onPaste={onLatPaste}
                placeholder="27.7172"
                inputMode="decimal"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Longitude *</label>
              <input
                className={inputCls}
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="85.3240"
                inputMode="decimal"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Sort order</label>
            <input
              className={inputCls}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="0"
              inputMode="numeric"
            />
            <p className="text-neutral-600 text-[11px] mt-2">
              Lower numbers appear first in the branch list. Leave at 0 to sort by city name.
            </p>
          </div>
        </section>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onDone(false)}
            disabled={busy}
            className="flex-1 sm:flex-none text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-700 hover:border-neutral-500 rounded-lg px-6 py-3 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 sm:flex-none text-xs font-bold uppercase tracking-wider bg-[#e31837] hover:bg-[#b6132c] disabled:opacity-50 text-white rounded-lg px-6 py-3 transition-colors"
          >
            {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Branch'}
          </button>
        </div>
      </form>
    </div>
  );
}
