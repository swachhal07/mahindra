import React, { useState, useEffect } from 'react';
import { Calendar, Compass, ShieldAlert, Award, FileText, CheckCircle2, Trash2, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls, Buildings3D } from '../components/Map';
import { useT } from '../utils/i18n';

export default function Booking() {
  const t = useT();
  const [bookings, setBookings] = useState([]);
  const [successMsg, setSuccessMsg] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    model: 'BlazoX 35 Truck',
    date: '',
    location: 'M.V Dugar Building, Kathmandu',
    consent: false
  });

  const vehiclesList = [
    'LoadKing Optimo Truck 25',
    'LoadKing Optimo Tipper 25',
    'Supro Mini Profit Truck LX Model',
    'Supro Maxi Profit Truck VX Model',
    'Mahindra Earthmaster SX90 (Backhole Loader)',
    'BlazoX Tipper m Dura',
    'BlazoX 35 Truck'
  ];

  const locationsList = [
    'M.V Dugar Building, Kathmandu'
  ];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const list = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('mahindra_booking_')) {
        try {
          list.push({
            id: key,
            data: JSON.parse(localStorage.getItem(key))
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Sort by id (timestamp desc)
    list.sort((a, b) => b.id.localeCompare(a.id));
    setBookings(list);
  };

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please accept the terms to proceed.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    // Keep a local copy for offline / audit purposes (existing behavior).
    const key = `mahindra_booking_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(formData));

    try {
      // POST to the Express backend, which emails the booking via Gmail SMTP.
      // In dev, Vite proxies /api/* to localhost:5174 (see vite.config.js).
      // In production (Vercel), set VITE_API_BASE_URL to the deployed
      // backend's origin (e.g. https://mahindra-api.onrender.com) so this
      // fetch hits the right host. Leave empty to keep using same-origin /api.
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const resp = await fetch(`${apiBase}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.ok) {
        throw new Error(data.error || `Request failed (${resp.status})`);
      }

      setSuccessMsg(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        model: 'BlazoX 35 Truck',
        date: '',
        location: 'M.V Dugar Building, Kathmandu',
        consent: false
      });
      loadBookings();
      setTimeout(() => setSuccessMsg(false), 8000);
    } catch (err) {
      console.error('Booking submit failed:', err);
      setErrorMsg(
        'We saved your booking locally but could not email it right now. ' +
          'Please try again, or contact us directly at info@dugarautoclinic.com.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBooking = (id) => {
    localStorage.removeItem(id);
    loadBookings();
  };

  return (
    <div className="pb-20 bg-white text-gray-800 min-h-screen">
      {/* Dark Hero Banner */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 110% 90% at 90% 20%, rgba(150,35,35,0.45) 0%, rgba(100,20,20,0.28) 25%, rgba(50,10,10,0.15) 50%, rgba(15,3,3,0.05) 75%, rgba(0,0,0,0) 95%), radial-gradient(ellipse 80% 60% at 10% 5%, rgba(100,25,25,0.22) 0%, rgba(40,8,8,0.08) 45%, rgba(0,0,0,0) 80%), #000',
        }}
      >
        {/* Navbar spacer */}
        <div className="absolute top-0 left-0 right-0 h-[88px]" />

        <div className="relative z-10 text-center px-6 lg:px-10 pt-[140px] pb-24 max-w-6xl mx-auto w-full">
          <p className="text-[rgb(213,59,59)] text-xs sm:text-sm font-bold uppercase tracking-[0.35em] mb-8">
            {t('booking.eyebrow')}
          </p>
          <h1 className="font-black uppercase tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl">
            <span className="text-white">{t('booking.headline1')}</span><br />
            <span className="text-[rgb(213,59,59)]">{t('booking.headline2')}</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg mt-10 max-w-2xl mx-auto leading-relaxed">
            {t('booking.sub')}
          </p>
        </div>
      </section>

      {/* Reach Us + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left — Reach Us Info */}
          <div className="lg:col-span-5">
            <p className="text-[rgb(213,59,59)] text-xs font-bold uppercase tracking-[0.3em] mb-5">
              {t('booking.reachUs')}
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] mb-6 whitespace-pre-line">
              {t('booking.reachUs.title')}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-10">
              We respond to every inquiry within one business day. Our Mahindra team covers Nepal end-to-end — sales, service, and parts under one roof.
            </p>

            <div className="space-y-5 border-t border-gray-200 pt-6">
              {[
                { icon: <Phone className="w-5 h-5 text-[rgb(213,59,59)]" />, label: 'Sales', value: '+977 9802748575' },
                { icon: <Mail className="w-5 h-5 text-[rgb(213,59,59)]" />, label: 'Email', value: 'info@dugarautoclinic.com' },
                { icon: <MapPin className="w-5 h-5 text-[rgb(213,59,59)]" />, label: 'Office', value: 'MV Dugar Building, Kathmandu, Nepal' },
                { icon: <Clock className="w-5 h-5 text-[rgb(213,59,59)]" />, label: 'Hours', value: 'Sun – Fri, 9:30 AM – 6:00 PM' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 pb-5 border-b border-gray-200 last:border-b-0">
                  <div className="w-11 h-11 rounded-md bg-[rgb(213,59,59)]/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">{item.label}</p>
                    <p className="text-gray-950 font-extrabold text-base tracking-tight">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Booking Form */}
          <div className="lg:col-span-7 bg-mahindra-lightGray border border-black/5 shadow-sm rounded-2xl p-6 sm:p-10 text-left relative">
            <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-2 text-gray-955">
              <Calendar className="w-5 h-5 text-mahindra-red" />
              Request Test Drive Slot
            </h3>

            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-650 p-4 rounded-lg flex flex-col items-center gap-2 mb-6 text-center animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
                <span className="font-bold uppercase tracking-wider text-sm">Booking Requested Successfully!</span>
                <span className="text-xs text-gray-600">
                  Your details have been registered. A Mahindra Experience Manager will call you to confirm your schedule.
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mb-6 text-center text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Your Full Name</label>
                  <input
                    id="booking-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Phone Number</label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Email Address</label>
                <input
                  id="booking-email"
                  type="email"
                  required
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Vehicle Selection</label>
                  <select
                    id="booking-model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                  >
                    {vehiclesList.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Experience Center Location</label>
                  <select
                    id="booking-location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                  >
                    {locationsList.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Preferred Test Drive Date</label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    id="booking-consent"
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                    className="mt-1 w-4 h-4 bg-white border-black/15 rounded text-mahindra-red focus:ring-mahindra-red focus:ring-offset-white cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 leading-normal">
                    I consent to receiving test drive configurations, commercial quote updates, and calls from Mahindra dealership representatives regarding this request.
                  </span>
                </label>
              </div>

              <button
                id="booking-submit-btn"
                type="submit"
                disabled={submitting}
                className="w-full bg-black hover:bg-[#e21b22] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded font-bold uppercase tracking-wider text-sm transition-colors duration-300"
              >
                {submitting ? 'Sending…' : t('booking.submit')}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-6">
          <p className="text-[rgb(213,59,59)] text-xs font-bold uppercase tracking-[0.3em] mb-3">
            Find Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight leading-[1.05]">
            Our Showroom in Kathmandu.
          </h2>
        </div>
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <Map
            theme="light"
            zoom={16}
            center={[85.3021967, 27.7299094]}
            pitch={60}
            bearing={-25}
            styles={{
              light: 'https://tiles.openfreemap.org/styles/positron',
              dark: 'https://tiles.openfreemap.org/styles/dark',
            }}
          >
            <Buildings3D color="#c8c8c8" opacity={0.9} />
            <MapControls position="bottom-right" showZoom showLocate showFullscreen showCompass />
            <MapMarker longitude={85.3021967} latitude={27.7299094}>
              <MarkerContent>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-10 h-10 rounded-full bg-[rgb(213,59,59)]/20 animate-ping" />
                  <div className="relative w-7 h-7 rounded-full bg-[rgb(213,59,59)] border-2 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </MarkerContent>
              <MarkerPopup>
                <div className="min-w-[200px]">
                  <p className="text-[rgb(213,59,59)] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                    Dugar Auto Clinic
                  </p>
                  <h4 className="text-gray-950 font-extrabold text-sm uppercase mb-1">
                    Kathmandu Showroom
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    MV Dugar Building, Kathmandu, Nepal
                  </p>
                </div>
              </MarkerPopup>
            </MapMarker>
          </Map>
        </div>

        {/* Get Directions link */}
        <div className="mt-6 flex justify-center">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=27.7299094,85.3021967"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-transparent border border-gray-800 hover:bg-[#e21b22] hover:border-[#e21b22] text-gray-900 hover:text-white font-bold uppercase tracking-wider text-sm px-8 py-4 transition-all duration-300"
          >
            <Compass className="w-4 h-4" />
            <span>Get Directions on Google Maps</span>
          </a>
        </div>
      </section>
    </div>
  );
}
