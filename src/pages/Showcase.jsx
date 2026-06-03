import React, { useState } from 'react';
import { Sparkles, Sliders, ArrowRight, Eye, Shield } from 'lucide-react';

export default function Showcase({ setCurrentPage }) {
  const [filter, setFilter] = useState('all');
  const [selectedColor, setSelectedColor] = useState('red');
  const [activeSpecModel, setActiveSpecModel] = useState(null);

  const vehicles = [
    {
      id: 'thar',
      name: 'Mahindra Thar',
      category: 'suv',
      tagline: 'Conquer the unconquered',
      image: '/images/thar.png',
      price: 'Starting from ₹11.25 Lakh',
      specs: {
        engine: '2.0L mStallion TGDi / 2.2L mHawk',
        power: '150 bhp / 130 bhp',
        transmission: '6-Speed Manual / Automatic',
        seating: '4-Seating Layout'
      }
    },
    {
      id: 'xuv400',
      name: 'XUV400 EV',
      category: 'ev',
      tagline: 'Pure Electric Thrills',
      image: '/images/ev.png',
      price: 'Starting from ₹15.49 Lakh',
      specs: {
        battery: '39.4 kWh Li-ion',
        range: '456 km (MIDC Certified)',
        acceleration: '0-100 km/h in 8.3s',
        transmission: 'Single Speed Automatic'
      }
    },
    {
      id: 'scorpio-n',
      name: 'Scorpio-N',
      category: 'suv',
      tagline: 'The Big Daddy of SUVs',
      image: '/images/thar.png', // Fallback to thar.png but styled differently
      price: 'Starting from ₹13.60 Lakh',
      specs: {
        engine: '2.0L Petrol / 2.2L Diesel',
        power: '200 bhp / 172 bhp',
        transmission: '6-Speed MT / AT with 4WD',
        seating: '6 or 7 Seater'
      }
    },
    {
      id: 'xuv700',
      name: 'XUV700',
      category: 'suv',
      tagline: 'Sci-Fi Technology Meets Raw Power',
      image: '/images/ev.png', // Fallback to ev.png styled differently
      price: 'Starting from ₹13.99 Lakh',
      specs: {
        engine: '2.0L Turbo Petrol / 2.2L Diesel',
        power: '197 bhp / 182 bhp',
        safety: '5-Star Global NCAP Rating',
        seating: '5 or 7 Seater'
      }
    }
  ];

  // Colorizer Configuration
  const colorizerColors = {
    red: {
      name: "Rage Red",
      hex: "#e21b22",
      class: "bg-[#e21b22]",
      previewStyle: "bg-gradient-to-tr from-[#5a060a] to-[#e21b22]"
    },
    black: {
      name: "Napoli Black",
      hex: "#1a1a1a",
      class: "bg-[#1a1a1a]",
      previewStyle: "bg-gradient-to-tr from-[#000000] to-[#2b2b2b]"
    },
    silver: {
      name: "Dazzling Silver",
      hex: "#d1d5db",
      class: "bg-[#d1d5db]",
      previewStyle: "bg-gradient-to-tr from-[#6b7280] to-[#d1d5db]"
    },
    white: {
      name: "Everest White",
      hex: "#f9fafb",
      class: "bg-[#f9fafb]",
      previewStyle: "bg-gradient-to-tr from-[#9ca3af] to-[#ffffff]"
    }
  };

  const filteredVehicles = filter === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.category === filter);

  return (
    <div className="pb-20 bg-mahindra-black text-gray-800 min-h-screen">
      {/* Dark Hero Banner */}
      <section
        className="relative pt-28 pb-16 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0508 50%, #0a0a0f 100%)' }}
      >
        {/* Subtle red glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full pointer-events-none" style={{ background: 'rgba(221,5,44,0.08)', filter: 'blur(80px)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgb(221,5,44)' }}>
            <span className="w-6 h-px" style={{ background: 'rgb(221,5,44)' }} />
            Mahindra Fleet
            <span className="w-6 h-px" style={{ background: 'rgb(221,5,44)' }} />
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            EXPLORE THE SHOWCASE
          </h1>
          <p className="text-white/55 max-w-2xl mx-auto text-base leading-relaxed">
            From award-winning safety to offroad adventures and electric high-performance drivetrains, find the Mahindra vehicle that is built to elevate your journey.
          </p>
        </div>
        {/* Bottom fade into page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #f5f6f9)' }} />
      </section>

      {/* Filter Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 flex flex-wrap justify-center gap-3" id="showcase-filters">
        {['all', 'suv', 'ev'].map((category) => (
          <button
            key={category}
            id={`filter-btn-${category}`}
            onClick={() => setFilter(category)}
            className={`px-6 py-2.5 rounded font-bold uppercase tracking-wider text-xs border transition-all duration-300 ${
              filter === category 
                ? 'bg-mahindra-red border-mahindra-red text-white shadow-lg shadow-mahindra-red/20' 
                : 'bg-transparent border-black/10 hover:border-black/30 text-gray-600 hover:text-black'
            }`}
          >
            {category === 'all' ? 'All Models' : category === 'suv' ? 'SUVs' : 'Electric (EV)'}
          </button>
        ))}
      </section>

      {/* Virtual Studio Colorizer (Interactive Feature Component) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
        <div className="bg-mahindra-lightGray border border-black/5 shadow-sm rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-mahindra-red/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Colorizer Image and Interactive Blending */}
            <div className="lg:col-span-7 flex flex-col justify-center items-center relative">
              <div className="absolute -inset-4 rounded-xl opacity-20 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
              
              {/* Studio Backdrop */}
              <div className="w-full aspect-video rounded-xl relative overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center">
                {/* Dynamic colored background light matching selected color */}
                <div className={`absolute inset-0 opacity-10 transition-colors duration-700 ${
                  selectedColor === 'red' ? 'bg-red-600' :
                  selectedColor === 'black' ? 'bg-gray-800' :
                  selectedColor === 'silver' ? 'bg-blue-300' :
                  'bg-white'
                }`} />

                {/* Main Vehicle Render with color filter blending */}
                <div className="relative w-[85%] h-[85%] flex items-center justify-center">
                  <img
                    src="/images/ev.png"
                    alt="XUV Studio Customizer"
                    className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                  />
                  {/* Color Overlay blending layer */}
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-color opacity-70 transition-all duration-700 rounded-lg"
                    style={{ backgroundColor: colorizerColors[selectedColor].hex }}
                  />
                </div>

                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 flex items-center gap-1.5 text-xs text-gray-400">
                  <Sparkles className="w-3.5 h-3.5 text-mahindra-red animate-pulse" />
                  <span>Interactive Virtual Studio Mode</span>
                </div>
              </div>
            </div>

            {/* Customizer Controls */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="space-y-1">
                <span className="text-mahindra-red font-bold text-xs tracking-widest uppercase">Digital Studio</span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-gray-950">XUV Concept Customizer</h3>
                <p className="text-gray-600 text-sm">
                  Visualize your bespoke XUV Concept. Toggle premium paint options and experience studio configurations in real-time.
                </p>
              </div>

              {/* Color Selectors */}
              <div className="space-y-3">
                <span className="text-gray-950 font-bold text-sm block">Select Premium Paint:</span>
                <div className="flex gap-4" id="colorizer-options">
                  {Object.entries(colorizerColors).map(([key, data]) => (
                    <button
                      key={key}
                      id={`color-option-${key}`}
                      onClick={() => setSelectedColor(key)}
                      className={`w-10 h-10 rounded-full border-2 focus:outline-none transition-all duration-300 ${
                        selectedColor === key 
                          ? 'border-mahindra-red scale-110 shadow-lg shadow-mahindra-red/40' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={data.name}
                    >
                      <div className={`w-full h-full rounded-full ${data.class} border border-black/20`} />
                    </button>
                  ))}
                </div>
                <div className="pt-1.5 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Selected Color:</span>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded">
                    {colorizerColors[selectedColor].name}
                  </span>
                </div>
              </div>

              {/* Specs for colorizer */}
              <div className="bg-black/5 border border-black/5 rounded-lg p-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block uppercase font-semibold">Drive System</span>
                  <span className="text-gray-900 font-bold block mt-0.5">Dual Motor AWD</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-semibold">Max Range</span>
                  <span className="text-gray-900 font-bold block mt-0.5">510 km</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-semibold">0-100 km/h</span>
                  <span className="text-gray-900 font-bold block mt-0.5">4.9 seconds</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-semibold">Platform</span>
                  <span className="text-gray-900 font-bold block mt-0.5">INGLO Architecture</span>
                </div>
              </div>

              {/* Book Studio Vehicle */}
              <button
                id="booking-studio-cta"
                onClick={() => setCurrentPage('booking')}
                className="w-full bg-gray-900 hover:bg-mahindra-red text-white hover:text-white py-3.5 rounded font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Book This Customization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {filteredVehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="bg-mahindra-lightGray border border-black/5 shadow-sm rounded-xl overflow-hidden hover:border-mahindra-red/40 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Main Display */}
              <div className="p-6 pb-2 text-left relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-gray-900 group-hover:text-mahindra-red transition-colors duration-300">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 italic">{vehicle.tagline}</p>
                  </div>
                  <span className="bg-mahindra-red/10 border border-mahindra-red/30 text-mahindra-red px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    {vehicle.category === 'suv' ? 'SUV' : 'EV'}
                  </span>
                </div>

                <div className="w-full aspect-[16/10] my-6 overflow-hidden rounded-lg bg-black/5 border border-black/5 flex items-center justify-center p-4">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Specs Toggle/Details & Actions */}
              <div className="px-6 pb-6 pt-2">
                {/* Expandable specs panel */}
                <div className="bg-black/5 border border-black/5 rounded-lg p-4 mb-4 text-left">
                  <div className="flex items-center justify-between mb-3 border-b border-black/10 pb-2">
                    <span className="text-xs font-bold uppercase text-gray-600 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-mahindra-red" />
                      Key Specifications
                    </span>
                    <span className="text-xs font-bold text-mahindra-red">{vehicle.price}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] sm:text-xs">
                    {Object.entries(vehicle.specs).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-gray-500 block uppercase font-semibold">{key}</span>
                        <span className="text-gray-900 font-medium block mt-0.5">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="flex gap-3">
                  <button
                    id={`book-btn-${vehicle.id}`}
                    onClick={() => setCurrentPage('booking')}
                    className="flex-1 bg-mahindra-red hover:bg-mahindra-darkRed text-white py-3 rounded font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-md shadow-mahindra-red/10 hover:shadow-mahindra-red/30"
                  >
                    Book Test Drive
                  </button>
                  <button
                    id={`details-btn-${vehicle.id}`}
                    onClick={() => {
                      setActiveSpecModel(activeSpecModel === vehicle.id ? null : vehicle.id);
                    }}
                    className="px-4 bg-black/5 hover:bg-black/10 text-gray-800 rounded border border-black/10 hover:border-black/20 transition-all duration-300"
                    title="Toggle details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Additional Spec Drawer details */}
                {activeSpecModel === vehicle.id && (
                  <div className="mt-4 p-4 bg-black/5 border border-mahindra-red/20 text-left rounded-lg text-xs space-y-2 animate-fadeIn">
                    <span className="text-mahindra-red font-bold block uppercase tracking-wider">Premium Coverage</span>
                    <p className="text-gray-600">
                      Standard package includes 3 Years / 100,000 km Warranty, 24/7 Roadside Assistance, and complimentary first year subscription to Adrenox Connected car features.
                    </p>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold pt-1">
                      <Shield className="w-3.5 h-3.5" />
                      <span>5-Star Safety Standards Assured</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
