import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import VehicleForm from './VehicleForm';
import { api, assetUrl } from '../utils/adminApi';

const CATEGORY_LABELS = {
  truck: 'Truck',
  tipper: 'Tipper',
  light: 'Light Commercial',
  construction: 'Construction',
  bus: 'Bus',
};

// Vehicle tab of the admin dashboard. Lists every vehicle with edit/delete
// and opens VehicleForm for add/edit. Self-contained (its own loading,
// error, delete-confirm state) so Dashboard.jsx stays small.
export default function VehicleList() {
  const [vehicles, setVehicles] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false); // false=list, null=new, object=edit
  const [deleting, setDeleting] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);

  const load = async () => {
    setError('');
    try {
      const data = await api('/api/vehicles');
      setVehicles(data.vehicles);
    } catch (err) {
      setVehicles([]);
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    setBusyDelete(true);
    try {
      await api(`/api/vehicles/${deleting.id}`, { method: 'DELETE', auth: true });
      setDeleting(null);
      await load();
    } catch (err) {
      setError(err.message);
      setDeleting(null);
    } finally {
      setBusyDelete(false);
    }
  };

  if (editing !== false) {
    return (
      <VehicleForm
        vehicle={editing}
        onDone={(saved) => {
          setEditing(false);
          if (saved) load();
        }}
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-neutral-400 text-sm">
          {vehicles === null
            ? 'Loading…'
            : `${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'} in the catalog`}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            title="Refresh"
            className="text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg p-2.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditing(null)}
            className="inline-flex items-center gap-2 bg-[#e21b22] hover:bg-[#c4151b] text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            {error}
            <p className="text-red-400/70 text-xs mt-1">
              Make sure the backend server is running and MongoDB is configured.
            </p>
          </div>
        </div>
      )}

      {vehicles !== null && vehicles.length === 0 && !error && (
        <div className="text-center border border-dashed border-neutral-800 rounded-2xl py-20 text-neutral-500">
          <p className="font-bold uppercase tracking-wider text-sm mb-2">No vehicles yet</p>
          <p className="text-xs">
            Click “Add Vehicle” to create one, or run <code>npm run seed</code> in /backend to
            import the original lineup.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(vehicles ?? []).map((v) => (
          <div
            key={v.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col"
          >
            <div className="h-40 bg-white flex items-center justify-center overflow-hidden">
              <img
                src={assetUrl(v.imageUrl)}
                alt={v.name}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="p-4 flex-grow">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-black uppercase tracking-tight text-sm leading-snug">
                  {v.name}
                </h3>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300 rounded-full px-2.5 py-1">
                  {CATEGORY_LABELS[v.category] ?? v.category}
                </span>
              </div>
              {v.tagline && (
                <p className="text-neutral-500 text-xs mt-1.5 line-clamp-2">{v.tagline}</p>
              )}
              <p className="text-neutral-600 text-[11px] mt-2">
                {v.specs.length} spec{v.specs.length === 1 ? '' : 's'} · {v.gallery.length}{' '}
                gallery photo{v.gallery.length === 1 ? '' : 's'}
                {v.brochureUrl ? ' · brochure' : ''}
              </p>
            </div>
            <div className="border-t border-neutral-800 px-4 py-3 flex gap-2">
              <button
                onClick={() => setEditing(v)}
                className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-3 py-2 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => setDeleting(v)}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded-lg px-3 py-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {deleting && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !busyDelete && setDeleting(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-7 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-black uppercase tracking-tight text-lg mb-2">Delete vehicle?</h2>
            <p className="text-neutral-400 text-sm mb-6">
              “{deleting.name}” and its photos will be permanently removed from the website. This
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleting(null)}
                disabled={busyDelete}
                className="flex-1 text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-700 rounded-lg px-4 py-2.5 hover:border-neutral-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={busyDelete}
                className="flex-1 text-xs font-bold uppercase tracking-wider bg-[#e21b22] hover:bg-[#c4151b] disabled:opacity-50 text-white rounded-lg px-4 py-2.5 transition-colors"
              >
                {busyDelete ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
