import React, { useState } from 'react';
import { LogOut, Car, Newspaper } from 'lucide-react';
import VehicleList from './VehicleList';
import BlogList from './BlogList';

const TABS = [
  { key: 'vehicles', label: 'Vehicles', Icon: Car },
  { key: 'blog', label: 'Blog Posts', Icon: Newspaper },
];

// Thin shell for the admin portal — top bar with the brand, the signed-in
// admin's email, a logout button (with confirmation), and a tab switcher
// for the two manageable sections.
export default function Dashboard({ adminEmail, onLogout }) {
  const [tab, setTab] = useState('vehicles');
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 bg-black/60 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[#e21b22] text-[10px] font-bold uppercase tracking-[0.3em]">
              Mahindra Nepal
            </p>
            <h1 className="font-black uppercase tracking-tight text-lg leading-tight">
              Content Manager
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-neutral-500 text-xs">{adminEmail}</span>
            <button
              onClick={() => setConfirmLogout(true)}
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider border border-neutral-700 hover:border-neutral-500 rounded-lg px-3 py-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-neutral-800/60">
          {TABS.map(({ key, label, Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                  active
                    ? 'text-white border-[#e21b22]'
                    : 'text-neutral-500 hover:text-neutral-200 border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {tab === 'vehicles' && <VehicleList />}
        {tab === 'blog' && <BlogList />}
      </main>

      {confirmLogout && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-7 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-black uppercase tracking-tight text-lg mb-2">Log out?</h2>
            <p className="text-neutral-400 text-sm mb-6">
              You'll need to sign in again to manage the website.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-700 rounded-lg px-4 py-2.5 hover:border-neutral-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#e21b22] hover:bg-[#c4151b] text-white rounded-lg px-4 py-2.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
