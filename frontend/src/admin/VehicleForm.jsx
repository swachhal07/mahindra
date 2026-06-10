import React, { useMemo, useState } from 'react';
import { ArrowLeft, Plus, X, Upload, FileText, Trash2, AlertTriangle } from 'lucide-react';
import { api, assetUrl } from '../utils/adminApi';

const CATEGORIES = [
  { key: 'truck', label: 'Truck' },
  { key: 'tipper', label: 'Tipper' },
  { key: 'light', label: 'Light Commercial' },
  { key: 'construction', label: 'Construction' },
  { key: 'bus', label: 'Bus' },
];

const inputCls =
  'w-full bg-black/60 border border-neutral-700 focus:border-[#e21b22] rounded-lg text-white text-sm px-3.5 py-2.5 outline-none transition-colors';
const labelCls =
  'text-neutral-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block';

// Add/edit form. `vehicle` is null for "add new", or the serialized vehicle
// from the API for editing. Submits multipart/form-data matching the
// backend contract in backend/routes/vehicles.js.
export default function VehicleForm({ vehicle, onDone }) {
  const isEdit = Boolean(vehicle);

  const [name, setName] = useState(vehicle?.name ?? '');
  const [category, setCategory] = useState(vehicle?.category ?? 'truck');
  const [tagline, setTagline] = useState(vehicle?.tagline ?? '');
  const [price, setPrice] = useState(vehicle?.price ?? 'Contact for pricing');
  const [specs, setSpecs] = useState(
    vehicle?.specs?.length ? vehicle.specs.map((s) => ({ ...s })) : [{ label: '', value: '' }]
  );

  // Main image: a new File replaces the existing one (edit) or is required (add).
  const [imageFile, setImageFile] = useState(null);
  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : assetUrl(vehicle?.imageUrl)),
    [imageFile, vehicle]
  );

  // Gallery: existing entries (kept/relabelled/removed) + newly added files.
  const [existingGallery, setExistingGallery] = useState(
    vehicle?.gallery?.map((g) => ({ imageId: g.imageId, url: g.url, label: g.label })) ?? []
  );
  const [newGallery, setNewGallery] = useState([]); // [{file, label, preview}]

  // Brochure PDF.
  const [brochureFile, setBrochureFile] = useState(null);
  const [removeBrochure, setRemoveBrochure] = useState(false);
  const hasBrochure = Boolean(vehicle?.brochureUrl) && !removeBrochure;

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const updateSpec = (i, field, value) =>
    setSpecs((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const addGalleryFiles = (files) => {
    const items = Array.from(files).map((file) => ({
      file,
      label: '',
      preview: URL.createObjectURL(file),
    }));
    setNewGallery((prev) => [...prev, ...items]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Vehicle name is required.');
    if (!isEdit && !imageFile) return setError('Please choose a main vehicle image.');

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('category', category);
    fd.append('tagline', tagline.trim());
    fd.append('price', price.trim());
    fd.append(
      'specs',
      JSON.stringify(specs.filter((s) => s.label.trim() && s.value.trim()))
    );
    if (imageFile) fd.append('image', imageFile);
    if (isEdit) {
      fd.append(
        'existingGallery',
        JSON.stringify(existingGallery.map((g) => ({ imageId: g.imageId, label: g.label })))
      );
      if (removeBrochure) fd.append('removeBrochure', 'true');
    }
    for (const item of newGallery) fd.append('gallery', item.file);
    fd.append('galleryLabels', JSON.stringify(newGallery.map((i) => i.label.trim())));
    if (brochureFile) fd.append('brochure', brochureFile);

    setBusy(true);
    try {
      await api(isEdit ? `/api/vehicles/${vehicle.id}` : '/api/vehicles', {
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
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 bg-black/60 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => onDone(false)}
            className="text-neutral-400 hover:text-white transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-black uppercase tracking-tight text-lg">
            {isEdit ? `Edit — ${vehicle.name}` : 'Add Vehicle'}
          </h1>
        </div>
      </header>

      <form onSubmit={submit} className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {error && (
          <div className="flex items-start gap-3 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* ── Basics ── */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5">
          <h2 className="font-black uppercase tracking-wider text-sm text-[#e21b22]">Basics</h2>

          <div>
            <label className={labelCls}>Vehicle Name *</label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Blazo X 35 Truck"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Category *</label>
              <select
                className={inputCls}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Price</label>
              <input
                className={inputCls}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contact for pricing"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Tagline</label>
            <input
              className={inputCls}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Long-haul cargo. Class-leading mileage."
            />
          </div>
        </section>

        {/* ── Specifications ── */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black uppercase tracking-wider text-sm text-[#e21b22]">
              Specifications
            </h2>
            <button
              type="button"
              onClick={() => setSpecs((p) => [...p, { label: '', value: '' }])}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-3 py-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Spec
            </button>
          </div>
          <div className="space-y-3">
            {specs.map((s, i) => (
              <div key={i} className="flex gap-3">
                <input
                  className={inputCls}
                  value={s.label}
                  onChange={(e) => updateSpec(i, 'label', e.target.value)}
                  placeholder="Label (e.g. Payload)"
                />
                <input
                  className={inputCls}
                  value={s.value}
                  onChange={(e) => updateSpec(i, 'value', e.target.value)}
                  placeholder="Value (e.g. Up to 35T GVW)"
                />
                <button
                  type="button"
                  onClick={() => setSpecs((p) => p.filter((_, idx) => idx !== i))}
                  className="shrink-0 text-neutral-500 hover:text-red-400 transition-colors px-1"
                  title="Remove spec"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {specs.length === 0 && (
              <p className="text-neutral-600 text-xs">No specs — click “Add Spec”.</p>
            )}
          </div>
        </section>

        {/* ── Main image ── */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="font-black uppercase tracking-wider text-sm text-[#e21b22] mb-5">
            Main Image {isEdit ? '' : '*'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {imagePreview && (
              <div className="w-full sm:w-56 h-36 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
              </div>
            )}
            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-4 py-2.5 transition-colors">
                <Upload className="w-4 h-4" />
                {imageFile ? imageFile.name : isEdit ? 'Replace image' : 'Choose image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <p className="text-neutral-600 text-xs mt-3">
                PNG with a transparent background looks best on the showcase grid. Max 12 MB.
              </p>
            </div>
          </div>
        </section>

        {/* ── Gallery ── */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black uppercase tracking-wider text-sm text-[#e21b22]">
              Feature Gallery
            </h2>
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-3 py-2 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add Photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) addGalleryFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          {existingGallery.length === 0 && newGallery.length === 0 && (
            <p className="text-neutral-600 text-xs">
              Optional — photos of the engine, cabin, chassis etc., shown on the vehicle's detail
              page with a caption each.
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {existingGallery.map((g, i) => (
              <div key={g.imageId} className="bg-black/40 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-neutral-800 overflow-hidden relative">
                  <img src={assetUrl(g.url)} alt={g.label} className="w-full h-full object-cover" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => setExistingGallery((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-900 text-white rounded-full p-1.5 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  className="w-full bg-transparent text-white text-xs px-3 py-2.5 outline-none placeholder:text-neutral-600"
                  value={g.label}
                  onChange={(e) =>
                    setExistingGallery((p) =>
                      p.map((item, idx) => (idx === i ? { ...item, label: e.target.value } : item))
                    )
                  }
                  placeholder="Caption…"
                />
              </div>
            ))}

            {newGallery.map((g, i) => (
              <div key={g.preview} className="bg-black/40 border border-dashed border-neutral-700 rounded-lg overflow-hidden">
                <div className="aspect-video bg-neutral-800 overflow-hidden relative">
                  <img src={g.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewGallery((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-900 text-white rounded-full p-1.5 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1.5 left-1.5 bg-[#e21b22] text-white text-[9px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5">
                    New
                  </span>
                </div>
                <input
                  className="w-full bg-transparent text-white text-xs px-3 py-2.5 outline-none placeholder:text-neutral-600"
                  value={g.label}
                  onChange={(e) =>
                    setNewGallery((p) =>
                      p.map((item, idx) => (idx === i ? { ...item, label: e.target.value } : item))
                    )
                  }
                  placeholder="Caption…"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Brochure ── */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="font-black uppercase tracking-wider text-sm text-[#e21b22] mb-5">
            Brochure (PDF)
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {hasBrochure && !brochureFile && (
              <>
                <span className="inline-flex items-center gap-2 text-neutral-300 text-xs bg-black/40 border border-neutral-700 rounded-lg px-3 py-2.5">
                  <FileText className="w-4 h-4 text-[#e21b22]" />
                  Current brochure attached
                </span>
                <button
                  type="button"
                  onClick={() => setRemoveBrochure(true)}
                  className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded-lg px-3 py-2.5 transition-colors"
                >
                  Remove
                </button>
              </>
            )}
            {removeBrochure && !brochureFile && (
              <span className="text-neutral-500 text-xs">
                Brochure will be removed when you save.{' '}
                <button
                  type="button"
                  onClick={() => setRemoveBrochure(false)}
                  className="text-neutral-300 underline"
                >
                  Undo
                </button>
              </span>
            )}
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-4 py-2.5 transition-colors">
              <Upload className="w-4 h-4" />
              {brochureFile ? brochureFile.name : hasBrochure ? 'Replace PDF' : 'Upload PDF'}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setBrochureFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </section>

        {/* ── Actions ── */}
        <div className="flex gap-3 pb-12">
          <button
            type="button"
            onClick={() => onDone(false)}
            disabled={busy}
            className="text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-700 hover:border-neutral-500 rounded-lg px-6 py-3.5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 sm:flex-none sm:px-10 inline-flex items-center justify-center gap-2 bg-[#e21b22] hover:bg-[#c4151b] disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-lg transition-colors"
          >
            {busy ? 'Saving… (uploading images may take a moment)' : isEdit ? 'Save Changes' : 'Create Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}
