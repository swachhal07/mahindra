import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, AlertTriangle, MapPin, Phone } from 'lucide-react';
import BranchForm from './BranchForm';
import { api } from '../utils/adminApi';

// Branches tab of the admin dashboard. Each row is a pin on the Service
// Network map on the public Contact page.
export default function BranchList() {
  const [branches, setBranches] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);

  const load = async () => {
    setError('');
    try {
      const data = await api('/api/branches');
      setBranches(data.branches);
    } catch (err) {
      setBranches([]);
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    setBusyDelete(true);
    try {
      await api(`/api/branches/${deleting.id}`, { method: 'DELETE', auth: true });
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
      <BranchForm
        branch={editing}
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
          {branches === null
            ? 'Loading…'
            : `${branches.length} branch${branches.length === 1 ? '' : 'es'} on the map`}
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
            className="inline-flex items-center gap-2 bg-[#e31837] hover:bg-[#b6132c] text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Branch
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {branches !== null && branches.length === 0 && !error && (
        <div className="text-center border border-dashed border-neutral-800 rounded-2xl py-20 text-neutral-500">
          <p className="font-bold uppercase tracking-wider text-sm mb-2">No branches yet</p>
          <p className="text-xs">
            The public map falls back to its built-in list until you add one here. Click
            “Add Branch”, or run <code>npm run seed:branches</code> in /backend to import
            the current 12.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(branches ?? []).map((b) => (
          <div
            key={b.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col"
          >
            <div className="p-4 flex-grow">
              <div className="flex items-center gap-2 text-[10px] mb-2">
                <span className="font-bold uppercase tracking-wider text-[#e31837]">
                  {b.province || 'No province'}
                </span>
                {b.district && (
                  <>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-500">{b.district}</span>
                  </>
                )}
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm leading-snug mb-2">
                {b.city}
              </h3>
              {b.phone && (
                <p className="inline-flex items-center gap-1.5 text-neutral-400 text-xs mb-1.5">
                  <Phone className="w-3 h-3" />
                  {b.phone}
                </p>
              )}
              <p className="inline-flex items-center gap-1.5 text-neutral-600 text-[10px] tabular-nums">
                <MapPin className="w-3 h-3" />
                {b.lat.toFixed(4)}, {b.lng.toFixed(4)}
              </p>
            </div>
            <div className="border-t border-neutral-800 px-4 py-3 flex gap-2">
              <button
                onClick={() => setEditing(b)}
                className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-3 py-2 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => setDeleting(b)}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded-lg px-3 py-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleting && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !busyDelete && setDeleting(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-7 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-black uppercase tracking-tight text-lg mb-2">Delete branch?</h2>
            <p className="text-neutral-400 text-sm mb-6">
              “{deleting.city}” will be removed from the Service Network map. This cannot be
              undone.
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
                className="flex-1 text-xs font-bold uppercase tracking-wider bg-[#e31837] hover:bg-[#b6132c] disabled:opacity-50 text-white rounded-lg px-4 py-2.5 transition-colors"
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
