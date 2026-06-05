import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useT } from '../utils/i18n';
import imgBlazoCargo from '../assets/mahindra-blazo-x-35-cargo.avif';
import imgBlazoTipper from '../assets/blazo_tipper_upscaled.png';
import imgBlazoTipperBs6 from '../assets/mahindra-blazo-x-28-bs6-tipper-truck.jpg';
import imgSuproMini from '../assets/supro-mini-truck-front-view.png';
import imgSuproMaxi from '../assets/mahindra-supro-profit-truck-excel.avif';
import imgEarthmasterSx90 from '../assets/mahindra_earthmaster_sx90_4wd_1_a0f2f3d5a8.webp';

export default function Showcase({ setCurrentPage }) {
  const [filter, setFilter] = useState('all');
  const t = useT();

  const vehicles = [
    {
      id: 'loadking-optimo-truck-25',
      name: 'LoadKing Optimo Truck 25',
      category: 'truck',
      tagline: 'Optimised load. Optimised profits.',
      image: imgBlazoCargo,
      price: 'Contact for pricing',
      specs: {
        category: 'Medium Duty Cargo',
        payload: 'Up to 25T GVW',
        engine: 'mDi Tech CRDe',
        useCase: 'Cargo / Logistics',
      },
    },
    {
      id: 'loadking-optimo-tipper-25',
      name: 'LoadKing Optimo Tipper 25',
      category: 'tipper',
      tagline: 'Built for the toughest sites.',
      image: imgBlazoTipperBs6,
      price: 'Contact for pricing',
      specs: {
        category: 'Medium Duty Tipper',
        payload: 'Up to 25T GVW',
        engine: 'mDi Tech CRDe',
        useCase: 'Construction / Quarry',
      },
    },
    {
      id: 'supro-mini-lx',
      name: 'Supro Mini Profit Truck LX',
      category: 'light',
      tagline: 'Compact. Capable. Always on time.',
      image: imgSuproMini,
      price: 'Contact for pricing',
      specs: {
        category: 'Light Commercial',
        payload: '750 kg',
        engine: '909cc DI Diesel',
        useCase: 'Last-Mile Delivery',
      },
    },
    {
      id: 'supro-maxi-vx',
      name: 'Supro Maxi Profit Truck VX',
      category: 'light',
      tagline: 'More payload, more profit.',
      image: imgSuproMaxi,
      price: 'Contact for pricing',
      specs: {
        category: 'Light Commercial',
        payload: '900 kg',
        engine: 'mDi Tech Diesel',
        useCase: 'City Logistics',
      },
    },
    {
      id: 'earthmaster-sx90',
      name: 'Mahindra EarthMaster SX90',
      category: 'construction',
      tagline: 'Power meets precision. 4WD backhoe loader.',
      image: imgEarthmasterSx90,
      price: 'Contact for pricing',
      specs: {
        category: 'Backhoe Loader',
        power: '90 HP CRDi',
        drive: '4WD',
        useCase: 'Heavy Construction',
      },
    },
    {
      id: 'blazox-tipper-m-dura',
      name: 'BlazoX Tipper m Dura',
      category: 'tipper',
      tagline: 'Heavy haulage with FuelSmart efficiency.',
      image: imgBlazoTipper,
      price: 'Contact for pricing',
      specs: {
        category: 'Heavy Duty Tipper',
        payload: 'Up to 35T',
        engine: 'mPower FuelSmart',
        useCase: 'Mining / Earthmoving',
      },
    },
    {
      id: 'blazox-35-truck',
      name: 'BlazoX 35 Truck',
      category: 'truck',
      tagline: 'Long-haul cargo. Class-leading mileage.',
      image: imgBlazoCargo,
      price: 'Contact for pricing',
      specs: {
        category: 'Heavy Duty Cargo',
        payload: 'Up to 35T GVW',
        engine: 'mPower FuelSmart',
        useCase: 'Long-Haul Logistics',
      },
    },
  ];

  const filterCategories = [
    { key: 'all', labelKey: 'showcase.filter.all' },
    { key: 'truck', labelKey: 'showcase.filter.truck' },
    { key: 'tipper', labelKey: 'showcase.filter.tipper' },
    { key: 'light', labelKey: 'showcase.filter.light' },
    { key: 'construction', labelKey: 'showcase.filter.construction' },
  ];

  const filteredVehicles = filter === 'all'
    ? vehicles
    : vehicles.filter(v => v.category === filter);

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
            {t('showcase.eyebrow')}
          </p>
          <h1 className="font-black uppercase tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl">
            <span className="text-white">{t('showcase.headline1')}</span><br />
            <span className="text-[rgb(213,59,59)]">{t('showcase.headline2')}</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg mt-10 max-w-2xl mx-auto leading-relaxed">
            {t('showcase.sub')}
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 flex flex-wrap justify-center gap-3" id="showcase-filters">
        {filterCategories.map(({ key, labelKey }) => (
          <button
            key={key}
            id={`filter-btn-${key}`}
            onClick={() => setFilter(key)}
            className={`px-6 py-2.5 rounded font-bold uppercase tracking-wider text-xs border transition-all duration-300 ${
              filter === key
                ? 'bg-transparent border-mahindra-red text-mahindra-red'
                : 'bg-transparent border-black/10 hover:border-black/30 text-gray-600 hover:text-black'
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </section>

      {/* Vehicle Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => setCurrentPage('booking')}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
            >
              {/* Image */}
              <div className="overflow-hidden h-56">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Content */}
              <div className="p-8">
                <h3 className="text-gray-950 text-xl font-black uppercase tracking-tight leading-tight mb-4">
                  {vehicle.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light mb-6">
                  {vehicle.tagline}
                </p>
                <div className="inline-flex items-center gap-3 bg-transparent border border-gray-800 group-hover:bg-[#e21b22] group-hover:border-[#e21b22] text-gray-900 group-hover:text-white font-bold uppercase tracking-wider text-sm px-8 py-4 transition-all duration-300">
                  <span>{t('showcase.viewDetails')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
