import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import mahindraLogo from '../assets/mahindra-logo-freelogovectors.net_.png';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="w-full">
      {/* Top Banner: Call to Action */}
      <div className="bg-[#b21e22] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="w-full lg:w-auto text-left">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-red-200 uppercase block mb-1">
              Ready to Experience It?
            </span>
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-none">
              Book a Test Drive Today.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto justify-end">
            <button
              id="footer-cta-booking"
              onClick={() => setCurrentPage('booking')}
              className="w-full sm:w-auto bg-white text-[#b21e22] hover:bg-neutral-100 transition-colors duration-300 font-bold uppercase tracking-wider text-xs sm:text-sm px-8 py-4 text-center cursor-pointer"
            >
              Book Test Drive
            </button>
            <a
              id="footer-cta-phone"
              href="tel:18002096006"
              className="w-full sm:w-auto bg-transparent border border-white/50 hover:border-white text-white hover:bg-white/10 transition-colors duration-300 font-bold tracking-wider text-xs sm:text-sm px-8 py-4 text-center cursor-pointer"
            >
              1800.209.6006
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="bg-[#0e0e0e] text-neutral-400 py-16 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Column 1: Logo and brand statement */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={mahindraLogo}
                  alt="Mahindra Logo"
                  className="h-6 w-auto object-contain filter brightness-0 invert"
                />
                <span className="text-lg font-black tracking-[0.15em] text-white">
                  MAHINDRA
                </span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-400 max-w-sm">
                Leading global manufacturer of utility vehicles, tractors, and electric solutions. Redefining mobility and driving positive change across 100+ countries.
              </p>
            </div>

            {/* Column 2: Navigate */}
            <div>
              <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5">
                Navigate
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    id="footer-nav-home"
                    onClick={() => setCurrentPage('home')}
                    className="hover:text-white transition-colors duration-300 text-left cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    id="footer-nav-showcase"
                    onClick={() => setCurrentPage('showcase')}
                    className="hover:text-white transition-colors duration-300 text-left cursor-pointer"
                  >
                    Vehicles Showcase
                  </button>
                </li>
                <li>
                  <button
                    id="footer-nav-agri"
                    onClick={() => setCurrentPage('agri-tech')}
                    className="hover:text-white transition-colors duration-300 text-left cursor-pointer"
                  >
                    Agri-Tech Division
                  </button>
                </li>
                <li>
                  <button
                    id="footer-nav-booking"
                    onClick={() => setCurrentPage('booking')}
                    className="hover:text-white transition-colors duration-300 text-left cursor-pointer"
                  >
                    Book a Test Drive
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Services/Divisions */}
            <div>
              <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5">
                Divisions
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <span className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-default">
                    SUV & Passenger Vehicles
                  </span>
                </li>
                <li>
                  <span className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-default">
                    Electric Mobility
                  </span>
                </li>
                <li>
                  <span className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-default">
                    Agri & Farm Equipment
                  </span>
                </li>
                <li>
                  <span className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-default">
                    Commercial Trucks
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="flex flex-col gap-5">
              <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase">
                Contact
              </h4>
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#b21e22] flex-shrink-0" />
                  <span className="text-neutral-400">
                    HQ: <a href="tel:18002096006" className="text-white font-medium hover:underline">1800.209.6006</a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#b21e22] flex-shrink-0" />
                  <span className="text-neutral-400">
                    INTL: <span className="text-white font-medium">(949) 207-3310</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#b21e22] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-400 leading-snug">
                    Gateway Building, Apollo Bunder, Mumbai, India
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#b21e22] flex-shrink-0" />
                  <a
                    href="mailto:customercare@mahindra.com"
                    className="hover:text-white transition-colors duration-300 text-neutral-400"
                  >
                    customercare@mahindra.com
                  </a>
                </li>
              </ul>
              <div className="mt-2 p-3.5 bg-[#141414] border-l-[3px] border-[#b21e22] rounded-sm">
                <p className="text-xs text-white font-semibold tracking-wider uppercase">
                  Accepting No Limits Worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#080808] py-6 border-t border-neutral-900 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Mahindra & Mahindra Ltd. All rights reserved.</p>
          <p className="tracking-widest uppercase font-semibold text-neutral-600 text-[10px]">
            Rise. Accept No Limits.
          </p>
        </div>
      </div>
    </footer>
  );
}

