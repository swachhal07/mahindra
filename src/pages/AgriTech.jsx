import React, { useState } from 'react';
import { Tractor, Sprout, Cpu, Smartphone, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function AgriTech({ setCurrentPage }) {
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [selectedTractor, setSelectedTractor] = useState('novo');
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    landSize: '',
    tractorModel: 'Mahindra Novo 75 HP'
  });

  const tractors = {
    novo: {
      name: "Mahindra Novo 75 HP",
      tagline: "The Powerhouse of Precision Farming",
      engine: "4-Cylinder Turbocharged Engine",
      liftCapacity: "2600 kg High lift capacity",
      tech: "Digisense 4G Connected IoT, Precision Hydraulics",
      bestFor: "Heavy agricultural implements, deep plowing, and commercial hauling."
    },
    yuvo: {
      name: "Mahindra Yuvo Tech+ 50 HP",
      tagline: "Next-Gen Technology for Higher Yields",
      engine: "4-Cylinder High-Torque M-Zip Engine",
      liftCapacity: "1700 kg Lift capacity",
      tech: "12F+3R Full Constant Mesh transmission, Smart Key",
      bestFor: "Rotary tilling, sowing, puddling and multi-crop farming."
    },
    jivo: {
      name: "Mahindra Jivo 30 HP",
      tagline: "Compact Power for Orchard Supremacy",
      engine: "3-Cylinder Fuel Efficient DI Engine",
      liftCapacity: "750 kg Lift capacity",
      tech: "Super-narrow width track, 4WD traction control",
      bestFor: "Vineyards, orchards, inter-culture operations and narrow rows."
    }
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (inquiryForm.name && inquiryForm.phone) {
      // Save query locally to simulate server save
      const key = `agri_inquiry_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(inquiryForm));
      setInquirySubmitted(true);
      setInquiryForm({ name: '', phone: '', landSize: '', tractorModel: 'Mahindra Novo 75 HP' });
      setTimeout(() => setInquirySubmitted(false), 6000);
    }
  };

  return (
    <div className="pb-20 bg-mahindra-black text-gray-800 min-h-screen">
      {/* Dark Hero Banner */}
      <section
        className="relative pt-28 pb-16 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #061a08 50%, #0a0a0f 100%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full pointer-events-none" style={{ background: 'rgba(221,5,44,0.07)', filter: 'blur(80px)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgb(221,5,44)' }}>
            <span className="w-6 h-px" style={{ background: 'rgb(221,5,44)' }} />
            Mahindra Agriculture
            <span className="w-6 h-px" style={{ background: 'rgb(221,5,44)' }} />
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            AGRI-TECH SOLUTIONS
          </h1>
          <p className="text-white/55 max-w-2xl mx-auto text-base leading-relaxed">
            Driving global agriculture with powerful tractors and smart farming systems designed to increase yields and empower farming communities worldwide.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #f5f6f9)' }} />
      </section>


      {/* Hero Product Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Display */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-mahindra-red/5 rounded-2xl pointer-events-none" />
            <div className="border border-black/5 shadow-sm rounded-2xl bg-gradient-to-b from-mahindra-lightGray to-mahindra-black p-4 sm:p-8 flex items-center justify-center">
              <img
                src="/images/tractor.png"
                alt="Mahindra Novo Tractor"
                className="max-h-96 object-contain transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Tech tag */}
            <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              <span>Digisense IoT Integrated</span>
            </div>
          </div>

          {/* Selector & Specs */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div className="space-y-1">
              <span className="text-mahindra-red font-bold text-xs tracking-widest uppercase">Smart Farm Fleet</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-gray-950">Power & Precision Redefined</h2>
              <p className="text-gray-600 text-sm">
                Choose a model to explore specialized specifications and agricultural use cases.
              </p>
            </div>

            {/* Selector Tabs */}
            <div className="flex gap-2" id="tractor-selectors">
              {Object.keys(tractors).map((key) => (
                <button
                  key={key}
                  id={`tractor-tab-${key}`}
                  onClick={() => {
                    setSelectedTractor(key);
                    setInquiryForm(prev => ({ ...prev, tractorModel: tractors[key].name }));
                  }}
                  className={`flex-1 py-3 px-2 text-center rounded font-bold uppercase tracking-wider text-xs border transition-all duration-300 ${
                    selectedTractor === key 
                      ? 'bg-mahindra-red border-mahindra-red text-white shadow-lg shadow-mahindra-red/20' 
                      : 'bg-transparent border-black/10 text-gray-600 hover:text-black hover:border-black/30'
                  }`}
                >
                  {key === 'novo' ? 'Novo (Heavy)' : key === 'yuvo' ? 'Yuvo (Utility)' : 'Jivo (Orchard)'}
                </button>
              ))}
            </div>

            {/* Spec details */}
            <div className="bg-mahindra-lightGray border border-black/5 shadow-sm rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-950 uppercase">{tractors[selectedTractor].name}</h3>
                <span className="text-xs text-mahindra-red italic block mt-0.5">{tractors[selectedTractor].tagline}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-black/10">
                <div>
                  <span className="text-gray-500 block uppercase font-semibold">Engine Engine/Power</span>
                  <span className="text-gray-950 font-bold block mt-0.5">{tractors[selectedTractor].engine}</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-semibold">Lifting Capacity</span>
                  <span className="text-gray-950 font-bold block mt-0.5">{tractors[selectedTractor].liftCapacity}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500 block uppercase font-semibold">Technology Integrated</span>
                  <span className="text-gray-950 font-bold block mt-0.5">{tractors[selectedTractor].tech}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500 block uppercase font-semibold">Optimal Land Application</span>
                  <span className="text-gray-600 block mt-0.5">{tractors[selectedTractor].bestFor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Agri features list */}
      <section className="py-16 bg-mahindra-darkGray border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <span className="text-mahindra-red font-bold uppercase tracking-widest text-xs">Farming 4.0</span>
            <h2 className="text-3xl font-black uppercase text-gray-950 tracking-tight">SMART FARMING TECHNOLOGY</h2>
            <p className="text-gray-650 text-sm">
              We leverage cloud diagnostics, high-precision hydraulics, and IoT integration to ensure smart yields with minimal resource input.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-mahindra-lightGray border border-black/5 shadow-sm p-6 rounded-lg">
              <div className="bg-mahindra-red/10 text-mahindra-red w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-gray-950 font-bold text-lg mb-2 uppercase">Digisense Connectivity</h4>
              <p className="text-gray-650 text-sm leading-relaxed">
                Monitor your tractor's position, geo-fence operations, track fuel levels, and receive real-time engine health alerts directly on your smartphone.
              </p>
            </div>

            <div className="bg-mahindra-lightGray border border-black/5 shadow-sm p-6 rounded-lg">
              <div className="bg-mahindra-red/10 text-mahindra-red w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <Sprout className="w-5 h-5" />
              </div>
              <h4 className="text-gray-950 font-bold text-lg mb-2 uppercase">Precision Agronomy</h4>
              <p className="text-gray-650 text-sm leading-relaxed">
                Tailored soil sensing diagnostics and custom planting implements built to operate at specific depth margins to maximize seed viability.
              </p>
            </div>

            <div className="bg-mahindra-lightGray border border-black/5 shadow-sm p-6 rounded-lg">
              <div className="bg-mahindra-red/10 text-mahindra-red w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-gray-950 font-bold text-lg mb-2 uppercase">Krishi Advisor Support</h4>
              <p className="text-gray-650 text-sm leading-relaxed">
                Instant agricultural consulting, crop advisory support, weather predictions, and regional farming guides synced directly through our dealer networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-mahindra-lightGray border border-black/5 shadow-sm rounded-2xl p-8 text-center space-y-6">
          <div className="space-y-2">
            <Tractor className="w-8 h-8 text-mahindra-red mx-auto" />
            <h3 className="text-2xl font-black uppercase text-gray-950">Request a Consultation</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Ready to upgrade your farm productivity? Submit your contact info below, and our regional team will contact you.
            </p>
          </div>

          {inquirySubmitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 p-4 rounded-lg flex flex-col items-center gap-2 max-w-md mx-auto animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <span className="font-bold uppercase tracking-wider text-sm mt-1">Enquiry Saved!</span>
              <span className="text-xs text-gray-600 text-center">
                Our local Mahindra Krishi consultant will reach out to you within 24 hours.
              </span>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="max-w-md mx-auto space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Your Full Name</label>
                <input
                  id="agri-name"
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Phone Number</label>
                <input
                  id="agri-phone"
                  type="tel"
                  required
                  placeholder="Enter contact number"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Land Size (Acres)</label>
                  <input
                    id="agri-land"
                    type="number"
                    placeholder="e.g. 5"
                    value={inquiryForm.landSize}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, landSize: e.target.value }))}
                    className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Model Selection</label>
                  <select
                    id="agri-model-select"
                    value={inquiryForm.tractorModel}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, tractorModel: e.target.value }))}
                    className="w-full bg-white border border-black/10 rounded px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-mahindra-red transition-all duration-300"
                  >
                    <option value="Mahindra Novo 75 HP">Mahindra Novo 75 HP</option>
                    <option value="Mahindra Yuvo Tech+ 50 HP">Mahindra Yuvo Tech+ 50 HP</option>
                    <option value="Mahindra Jivo 30 HP">Mahindra Jivo 30 HP</option>
                  </select>
                </div>
              </div>

              <button
                id="agri-submit"
                type="submit"
                className="w-full bg-mahindra-red hover:bg-mahindra-darkRed text-white py-3 rounded font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-md shadow-mahindra-red/20"
              >
                Submit Consultation Request
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
