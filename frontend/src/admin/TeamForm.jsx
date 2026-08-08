import React, { useMemo, useState } from 'react';
import { ArrowLeft, AlertTriangle, Upload } from 'lucide-react';
import { api, assetUrl } from '../utils/adminApi';

const inputCls =
  'w-full bg-black/60 border border-neutral-700 focus:border-[#e31837] rounded-lg text-white text-sm px-3.5 py-2.5 outline-none transition-colors';
const labelCls =
  'text-neutral-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block';

// How the portrait is cropped inside the fixed 3:4 tile on the public page.
const FOCAL_OPTIONS = [
  { value: 'center 15%', label: 'Face very high in frame' },
  { value: 'center 25%', label: 'Face high in frame (default)' },
  { value: 'center center', label: 'Centred' },
  { value: 'center 75%', label: 'Lower in frame' },
];

// Management team add/edit form. `member` is null for "add new", or the
// serialized member from the API for editing.
export default function TeamForm({ member, onDone, defaultGroup = 'management' }) {
  const isEdit = Boolean(member);

  const [group, setGroup] = useState(member?.group ?? defaultGroup);
  const [name, setName] = useState(member?.name ?? '');
  const [role, setRole] = useState(member?.role ?? '');
  const [focal, setFocal] = useState(member?.focal ?? 'center 25%');
  const [order, setOrder] = useState(member?.order != null ? String(member.order) : '0');
  const [photoFile, setPhotoFile] = useState(null);

  const photoPreview = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : assetUrl(member?.photoUrl)),
    [photoFile, member]
  );

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Name is required.');

    const fd = new FormData();
    fd.append('group', group);
    fd.append('name', name.trim());
    fd.append('role', role.trim());
    fd.append('focal', focal);
    fd.append('order', String(Number(order) || 0));
    if (photoFile) fd.append('photo', photoFile);

    setBusy(true);
    try {
      await api(isEdit ? `/api/team/${member.id}` : '/api/team', {
        method: isEdit ? 'PUT' : 'POST',
        body: fd,
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
    // Rendered inside the dashboard shell, which supplies the page background
    // and its own sticky header — so this header must not be sticky.
    <div className="text-white">
      <div className="border-b border-neutral-800 pb-4 mb-8 flex items-center gap-4">
        <button
          onClick={() => onDone(false)}
          className="text-neutral-400 hover:text-white transition-colors"
          title="Back to team"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-black uppercase tracking-tight text-lg">
          {isEdit
            ? `Edit: ${member.name}`
            : group === 'board'
              ? 'Add Director'
              : 'Add Team Member'}
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
          <h2 className="font-black uppercase tracking-wider text-sm text-[#e31837]">Details</h2>

          <div>
            <label className={labelCls}>Section</label>
            <div className="flex gap-2">
              {[
                { value: 'board', label: 'Board of Directors' },
                { value: 'management', label: 'Management Team' },
              ].map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGroup(g.value)}
                  className={`text-xs font-bold uppercase tracking-wider rounded-lg px-4 py-2.5 border transition-colors ${
                    group === g.value
                      ? 'border-[#e31837] text-white bg-[#e31837]/15'
                      : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <p className="text-neutral-600 text-[11px] mt-2">
              Which section of the public Leadership page this person appears in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Name *</label>
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sudeep Raj Subedi"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <input
                className={inputCls}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Business Head"
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
              Lower numbers appear first on the Leadership page.
            </p>
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5">
          <h2 className="font-black uppercase tracking-wider text-sm text-[#e31837]">Photo</h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-40 shrink-0">
              <div className="aspect-[3/4] bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ objectPosition: focal }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px] font-bold uppercase tracking-wider text-center px-3">
                    No photo
                  </div>
                )}
              </div>
              <p className="text-neutral-600 text-[10px] mt-2 text-center">
                Preview at the public 3:4 crop
              </p>
            </div>

            <div className="flex-grow space-y-5">
              <div>
                <label className={labelCls}>Portrait image</label>
                <label className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-200 border border-neutral-700 hover:border-neutral-500 rounded-lg px-4 py-2.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  {photoFile ? 'Change file' : isEdit ? 'Replace photo' : 'Choose file'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                {photoFile && (
                  <p className="text-neutral-500 text-xs mt-2 truncate">{photoFile.name}</p>
                )}
                <p className="text-neutral-600 text-[11px] mt-2">
                  A portrait shot works best. It is cropped to 3:4, so leave some space around
                  the head. Max 12 MB.
                </p>
              </div>

              <div>
                <label className={labelCls}>Crop position</label>
                <select
                  className={inputCls}
                  value={focal}
                  onChange={(e) => setFocal(e.target.value)}
                >
                  {FOCAL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className="text-neutral-600 text-[11px] mt-2">
                  Use this if the face sits too low or too high in the tile. The preview
                  updates as you change it.
                </p>
              </div>
            </div>
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
            {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
