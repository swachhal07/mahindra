import React, { useState, useEffect } from 'react';
import { Calendar, Compass, ShieldAlert, Award, FileText, CheckCircle2, Trash2 } from 'lucide-react';

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [successMsg, setSuccessMsg] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    model: 'Mahindra Thar',
    date: '',
    location: 'Mumbai - Apollo Bunder',
    consent: false
  });

  const vehiclesList = [
    'Mahindra Thar',
    'XUV400 EV',
    'Scorpio-N',
    'XUV700',
    'XUV Concept (Customized)'
  ];

  const locationsList = [
    'Mumbai - Apollo Bunder Center',
    'Delhi - Connaught Place Center',
    'Bangalore - Whitefield Center',
    'Pune - Hinjewadi Center',
    'Hyderabad - Gachibowli Center',
    'Chennai - Mount Road Center'
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

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please accept the terms to proceed.");
      return;
    }

    const key = `mahindra_booking_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(formData));
    setSuccessMsg(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      model: 'Mahindra Thar',
      date: '',
      location: 'Mumbai - Apollo Bunder',
      consent: false
    });
    loadBookings();
    setTimeout(() => setSuccessMsg(false), 8000);
  };

  const deleteBooking = (id) => {
    localStorage.removeItem(id);
    loadBookings();
  };

  return (
    <div className="pb-20 bg-mahindra-black text-gray-800 min-h-screen">
      {/* Dark Hero Banner */}
      <section
        className="relative pt-28 pb-16 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0508 50%, #0a0a0f 100%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full pointer-events-none" style={{ background: 'rgba(221,5,44,0.08)', filter: 'blur(80px)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgb(221,5,44)' }}>
            <span className="w-6 h-px" style={{ background: 'rgb(221,5,44)' }} />
            Experience Center
            <span className="w-6 h-px" style={{ background: 'rgb(221,5,44)' }} />
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            BOOK YOUR TEST DRIVE
          </h1>
          <p className="text-white/55 max-w-2xl mx-auto text-base leading-relaxed">
            Schedule a personalized track experience or a premium highway test drive with Mahindra's expert product advisors.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #f5f6f9)' }} />
      </section>

      {/* Main Grid: Form and Active Bookings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Booking Form */}
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
                className="w-full bg-mahindra-red hover:bg-mahindra-darkRed text-white py-3.5 rounded font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-md shadow-mahindra-red/20"
              >
                Book Experience Slot
              </button>
            </form>
          </div>

          {/* Booking List Drawer */}
          <div className="lg:col-span-5 bg-mahindra-lightGray border border-black/5 shadow-sm rounded-2xl p-6 text-left flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-2 text-gray-950">
                <FileText className="w-5 h-5 text-mahindra-red" />
                Active Bookings
              </h3>

              {bookings.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-black/10 rounded-xl bg-black/5">
                  <p className="text-gray-500 text-sm">No active test drive requests found.</p>
                  <p className="text-gray-600 text-xs mt-1">Book your slot to see details here.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="p-4 bg-black/5 border border-black/5 hover:border-black/10 rounded-lg flex justify-between items-start transition-all duration-300"
                    >
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-mahindra-red uppercase tracking-wider block bg-mahindra-red/10 border border-mahindra-red/20 px-2 py-0.5 rounded w-fit">
                          {booking.data.model}
                        </span>
                        <h4 className="text-gray-950 font-bold text-sm uppercase tracking-wide">{booking.data.name}</h4>
                        <p className="text-[11px] text-gray-600 block">
                          Date: <span className="text-gray-700">{booking.data.date}</span>
                        </p>
                        <p className="text-[11px] text-gray-600 block">
                          Center: <span className="text-gray-700">{booking.data.location}</span>
                        </p>
                      </div>

                      <button
                        id={`delete-booking-${booking.id}`}
                        onClick={() => deleteBooking(booking.id)}
                        className="p-1.5 rounded hover:bg-mahindra-red/10 text-gray-500 hover:text-mahindra-red transition-all duration-300"
                        title="Cancel booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Support section at the bottom of panel */}
            <div className="pt-6 border-t border-white/5 mt-6 text-xs text-gray-500 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-mahindra-red flex-shrink-0" />
              <span>Need to reschedule? Call our Experience Center helpdesk at 1800-209-6006.</span>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
