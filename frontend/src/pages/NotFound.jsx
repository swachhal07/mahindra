import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// Shown for any route the app does not recognise.
export default function NotFound({ setCurrentPage }) {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <section className="max-w-4xl mx-auto px-6 lg:px-10 pt-[180px] pb-32 text-center">
        <p className="text-[#e31837] text-xs font-bold uppercase tracking-[0.3em] mb-6">
          Error 404
        </p>

        <p className="font-black text-gray-950 leading-none tracking-tighter text-[6rem] sm:text-[9rem] lg:text-[11rem]">
          404
        </p>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] mt-2 after:content-[''] after:block after:w-14 after:h-1 after:bg-[#e31837] after:rounded-full after:mt-6 after:mx-auto">
          This road leads nowhere.
        </h1>

        <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto mt-8">
          The page you are looking for has been moved or never existed. The fleet, the showroom, and our team are all still where you left them.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <button
            id="notfound-home"
            onClick={() => setCurrentPage('home')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#e31837] hover:bg-[#c01430] text-white font-bold uppercase tracking-wider text-sm px-8 py-4 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <button
            id="notfound-showcase"
            onClick={() => setCurrentPage('showcase')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-transparent border border-gray-800 hover:bg-gray-950 hover:text-white text-gray-900 font-bold uppercase tracking-wider text-sm px-8 py-4 transition-all duration-300"
          >
            Browse Vehicles
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-16 pt-10 border-t border-gray-200">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.25em] mb-5">
            Or try one of these
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold">
            {[
              { id: 'about', label: 'About Us' },
              { id: 'blog', label: 'Blog' },
              { id: 'leadership', label: 'Leadership' },
              { id: 'booking', label: 'Book a Test Drive' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className="text-gray-500 hover:text-[#e31837] transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
