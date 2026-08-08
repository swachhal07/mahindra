import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import TeamForm from './TeamForm';
import { api, assetUrl } from '../utils/adminApi';

// Leadership tab of the admin dashboard: the board of directors and the
// management team portraits on the public Leadership page.
export default function TeamList() {
  const [members, setMembers] = useState(null);
  const [error, setError] = useState('');
  // false = list view; null/object = form ("add" carries the target group).
  const [editing, setEditing] = useState(false);
  const [addGroup, setAddGroup] = useState('management');
  const [deleting, setDeleting] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);

  const load = async () => {
    setError('');
    try {
      const data = await api('/api/team');
      setMembers(data.members);
    } catch (err) {
      setMembers([]);
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    setBusyDelete(true);
    try {
      await api(`/api/team/${deleting.id}`, { method: 'DELETE', auth: true });
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
      <TeamForm
        member={editing}
        defaultGroup={addGroup}
        onDone={(saved) => {
          setEditing(false);
          if (saved) load();
        }}
      />
    );
  }

  const startAdd = (group) => {
    setAddGroup(group);
    setEditing(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-neutral-400 text-sm">
          {members === null
            ? 'Loading…'
            : `${members.length} ${members.length === 1 ? 'person' : 'people'} on the Leadership page`}
        </p>
        <button
          onClick={load}
          title="Refresh"
          className="text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg p-2.5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {[
        { key: 'board', title: 'Board of Directors', addLabel: 'Add Director' },
        { key: 'management', title: 'Management Team', addLabel: 'Add Member' },
      ].map((section) => {
        const rows = (members ?? []).filter((m) => (m.group ?? 'management') === section.key);
        return (
          <section key={section.key} className="mb-12">
            <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-neutral-800">
              <h2 className="font-black uppercase tracking-wider text-sm">
                {section.title}
                <span className="text-neutral-600 ml-2 font-bold">{rows.length}</span>
              </h2>
              <button
                onClick={() => startAdd(section.key)}
                className="inline-flex items-center gap-2 bg-[#e31837] hover:bg-[#b6132c] text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                {section.addLabel}
              </button>
            </div>

            {members !== null && rows.length === 0 && !error && (
              <div className="text-center border border-dashed border-neutral-800 rounded-2xl py-14 text-neutral-500">
                <p className="text-xs">
                  Nobody here yet — the Leadership page falls back to its built-in list. Add
                  someone above, or run <code>npm run seed:team</code> in /backend to import
                  the current people.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {rows.map((m) => (
                <div
                  key={m.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="aspect-[3/4] bg-neutral-800 overflow-hidden">
                    {m.photoUrl ? (
                      <img
                        src={assetUrl(m.photoUrl)}
                        alt={m.name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: m.focal || 'center 25%' }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px] font-bold uppercase tracking-wider">
                        No photo
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-black uppercase tracking-tight text-sm leading-snug mb-1">
                      {m.name}
                    </h3>
                    <p className="text-[#e31837] text-[10px] font-bold uppercase tracking-wider">
                      {m.role || 'No role set'}
                    </p>
                  </div>
                  <div className="border-t border-neutral-800 px-4 py-3 flex gap-2">
                    <button
                      onClick={() => setEditing(m)}
                      className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-3 py-2 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(m)}
                      className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded-lg px-3 py-2 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {deleting && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !busyDelete && setDeleting(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-7 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-black uppercase tracking-tight text-lg mb-2">Remove member?</h2>
            <p className="text-neutral-400 text-sm mb-6">
              “{deleting.name}” will be removed from the Leadership page. This cannot be undone.
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
                {busyDelete ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
