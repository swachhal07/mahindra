import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, FileText } from 'lucide-react';
import { useT } from '../utils/i18n';
import { apiBase } from '../utils/adminApi';

// Vehicle PDF brochures — Vite will inline these as proper URLs at build time.
import brochureOptimo from '../assets/optimo.pdf';
import brochureSuproMini from '../assets/supro-profitminitruck-mini.pdf';
import brochureSuproMaxi from '../assets/supro-profitminitruck-maxi.pdf';
import brochureEarthmaster from '../assets/Infrajunction-prod__brochures_pdf4_e35f620584.pdf';
import brochureBlazo from '../assets/blazo-brochure.pdf';
import brochureCruzioGrande from '../assets/cruzio-grande.pdf';
import imgLoadkingTruck from '../assets/loadking optimo truck.png';
import imgLoadkingTipper from '../assets/Loadking optimo tipper.png';
import imgSuproMini from '../assets/supro-mini-truck-front-view.png';
import imgSuproMaxi from '../assets/Supro Maxi VX .png';
import imgEarthmasterSx90 from '../assets/mahindra-earthmaster-sx-1686128588.jpg';
import imgBlazoxTipperMDura from '../assets/blazoX35TipperM Dura.png';
import imgBlazoX35 from '../assets/BlazoX35.png';
import imgCruzioGrande from '../assets/7.png';
import imgCruzioSchool from '../assets/6.png';

// BlazoX 35 Truck — engineering / feature gallery
import blazoEngine from '../assets/engine.jpg';
import blazoSleeper from '../assets/sleeper.jpg';
import blazo3way from '../assets/3way.jpg';
import blazoDis from '../assets/dis.jpg';
import blazoDieselTank from '../assets/diseltank.jpg';
import blazoRadialTyres from '../assets/radialtyres (1).jpg';
import blazoTilt from '../assets/tilt.jpg';
import blazoHeadlamps from '../assets/headlamps.jpg';
import blazoChassis from '../assets/chasisframe.jpg';
import blazoClutch from '../assets/clutchsystem.jpg';
import blazoBraking from '../assets/brakingsystem.jpg';
import blazoApolloTyres from '../assets/gallery-8.jpg';
import blazoRearAxle from '../assets/gallery-9.jpg';

// Supro Mini Profit Truck LX — feature gallery
import suproGallery1 from '../assets/gallery_photo_big2.jpg';
import suproGallery2 from '../assets/gallery_photo_big3.jpg';
import suproGallery3 from '../assets/gallery_photo_big4.jpg';

// Supro Maxi Profit Truck VX — feature gallery
import suproMaxiGallery1 from '../assets/gallery_image_05.jpg';
import suproMaxiGallery2 from '../assets/gallery_image_06.jpg';
import suproMaxiGallery3 from '../assets/gallery_image_07.jpg';
import suproMaxiGallery4 from '../assets/gallery_image_08.jpg';

// Mahindra EarthMaster SX90 — feature gallery
import earthmasterGallery1 from '../assets/Screenshot 2026-06-07 113049.png';
import earthmasterGallery2 from '../assets/Screenshot 2026-06-07 113103.png';
import earthmasterGallery3 from '../assets/Screenshot 2026-06-07 113112.png';
import earthmasterGallery4 from '../assets/Screenshot 2026-06-07 113143.png';
import earthmasterGallery5 from '../assets/Screenshot 2026-06-07 113204.png';

// Cruzio Grande Bus — feature gallery
import cruzioGrandeGallery1 from '../assets/gallery-23.jpg';
import cruzioGrandeGallery2 from '../assets/gallery-21.jpg';
import cruzioGrandeGallery3 from '../assets/gallery-17.jpg';
import cruzioGrandeGallery4 from '../assets/gallery-13.jpg';
import cruzioGrandeGallery5 from '../assets/gallery-11.jpg';
import cruzioGrandeGallery6 from '../assets/gallery-6.jpg';
import cruzioGrandeGallery7 from '../assets/gallery-5.jpg';
import cruzioGrandeGallery8 from '../assets/gallery-4.jpg';

// LoadKing Optimo Tipper 25 — feature gallery
import loadkingTipperGallery1 from '../assets/gallery-5 (2).jpg';
import loadkingTipperGallery2 from '../assets/gallery-6 (2).jpg';
import loadkingTipperGallery3 from '../assets/gallery-4 (2).jpg';
import loadkingTipperGallery4 from '../assets/gallery-7 (1).jpg';
import loadkingTipperGallery5 from '../assets/gallery-2.jpg';
import loadkingTipperGallery6 from '../assets/gallery-1.jpg';
import loadkingTipperGallery7 from '../assets/gallery-3 (1).jpg';
import loadkingTipperGallery8 from '../assets/gallery-10 (2).jpg';

// Cruzio School Bus — feature gallery
import cruzioSchoolGallery1 from '../assets/gallery-4 (1).jpg';
import cruzioSchoolGallery2 from '../assets/gallery-5 (1).jpg';
import cruzioSchoolGallery3 from '../assets/gallery-6 (1).jpg';
import cruzioSchoolGallery4 from '../assets/gallery-7.jpg';
import cruzioSchoolGallery5 from '../assets/gallery-9 (1).jpg';
import cruzioSchoolGallery6 from '../assets/gallery-10 (1).jpg';
import cruzioSchoolGallery7 from '../assets/gallery-11 (1).jpg';
import cruzioSchoolGallery8 from '../assets/gallery-13 (1).jpg';
import cruzioSchoolGallery9 from '../assets/gallery-14 (1).jpg';

const suproMiniGallery = [
  { image: suproGallery1, label: 'Compact City Profile' },
  { image: suproGallery2, label: 'Spacious Cargo Bed' },
  { image: suproGallery3, label: 'Driver-First Cabin' },
];

const suproMaxiGallery = [
  { image: suproMaxiGallery1, label: 'Bold Front Stance' },
  { image: suproMaxiGallery2, label: 'High-Capacity Cargo Deck' },
  { image: suproMaxiGallery3, label: 'Comfort-First Interior' },
  { image: suproMaxiGallery4, label: 'mDi Tech Powertrain' },
];

const loadkingTipperGallery = [
  { image: loadkingTipperGallery1, label: 'mDi Diesel Engine' },
  { image: loadkingTipperGallery2, label: 'Driver Cabin Seating' },
  { image: loadkingTipperGallery3, label: 'Rear Chassis & Suspension' },
  { image: loadkingTipperGallery4, label: 'Heavy-Duty Rear Axle' },
  { image: loadkingTipperGallery5, label: 'Anti-Roll Stabilizer Bar' },
  { image: loadkingTipperGallery6, label: 'Driver Cockpit' },
  { image: loadkingTipperGallery7, label: 'Heavy-Duty Clutch Plate' },
  { image: loadkingTipperGallery8, label: 'Compact Tipper Profile' },
];

const cruzioSchoolGallery = [
  { image: cruzioSchoolGallery1, label: 'Student Seating Aisle' },
  { image: cruzioSchoolGallery2, label: 'Emergency Exit Door' },
  { image: cruzioSchoolGallery3, label: 'Fire Extinguisher' },
  { image: cruzioSchoolGallery4, label: 'Spacious Interior' },
  { image: cruzioSchoolGallery5, label: 'Heavy-Duty Clutch' },
  { image: cruzioSchoolGallery6, label: 'mPower Engine' },
  { image: cruzioSchoolGallery7, label: 'FuelSmart Drive Modes' },
  { image: cruzioSchoolGallery8, label: 'Stop Request Button' },
  { image: cruzioSchoolGallery9, label: 'First Aid Kit' },
];

const cruzioGrandeGallery = [
  { image: cruzioGrandeGallery1, label: 'Digital Instrument Cluster' },
  { image: cruzioGrandeGallery2, label: 'USB Charging Port' },
  { image: cruzioGrandeGallery3, label: 'Engineered Bus Chassis' },
  { image: cruzioGrandeGallery4, label: 'Driver Cockpit' },
  { image: cruzioGrandeGallery5, label: 'Heavy-Duty Leaf Suspension' },
  { image: cruzioGrandeGallery6, label: 'FuelSmart Drive Modes' },
  { image: cruzioGrandeGallery7, label: 'mPower Engine' },
  { image: cruzioGrandeGallery8, label: 'Comfort Passenger Seating' },
];

const earthmasterSX90Gallery = [
  { image: earthmasterGallery1, label: 'Engine' },
  { image: earthmasterGallery2, label: 'Cabin' },
  { image: earthmasterGallery3, label: 'Carraro Axle' },
  { image: earthmasterGallery4, label: 'Operator-First Cabin' },
  { image: earthmasterGallery5, label: 'Precision Hydraulics' },
];

const blazoX35Gallery = [
  { image: blazoEngine, label: 'BlazoX FuelSmart Engine' },
  { image: blazoTilt, label: 'Tilt Cabin' },
  { image: blazoSleeper, label: 'Sleeper Cabin' },
  { image: blazo3way, label: '3-Way Adjustable Driver Seat' },
  { image: blazoDis, label: 'Digital Instrument Cluster' },
  { image: blazoDieselTank, label: 'High-Capacity Diesel Tank' },
  { image: blazoChassis, label: 'Reinforced Chassis Frame' },
  { image: blazoClutch, label: 'Heavy-Duty Clutch System' },
  { image: blazoBraking, label: 'Air-Assist Braking System' },
  { image: blazoHeadlamps, label: 'Performance Headlamps' },
  { image: blazoApolloTyres, label: 'Apollo Endurance Tyres' },
  { image: blazoRearAxle, label: 'Heavy Duty Rear Axle' },
];

export default function Showcase({ setCurrentPage, initialFilter = 'all' }) {
  const [filter, setFilter] = useState(initialFilter);

  // Resync if the parent requests a different filter (e.g., footer Divisions click while already on this page).
  useEffect(() => { setFilter(initialFilter); }, [initialFilter]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [brochureUrl, setBrochureUrl] = useState(null);
  const t = useT();

  // Lock body scroll when the brochure modal is open and close on Escape.
  useEffect(() => {
    if (!brochureUrl) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setBrochureUrl(null); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [brochureUrl]);

  // Reset scroll on internal navigation (grid ↔ vehicle detail).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeVehicle]);

  // Map spec key → translation key so detail page renders proper labels
  const specLabelKey = {
    category: 'showcase.spec.category',
    payload: 'showcase.spec.payload',
    engine: 'showcase.spec.engine',
    useCase: 'showcase.spec.useCase',
    power: 'showcase.spec.power',
    drive: 'showcase.spec.drive',
  };

  // Hardcoded fallback catalog — used only when the backend API is
  // unreachable or its database is empty, so the public site never breaks.
  const fallbackVehicles = [
    {
      id: 'loadking-optimo-truck-2.5',
      name: 'LoadKing Optimo Truck 2.5',
      category: 'truck',
      tagline: 'Optimised load. Optimised profits.',
      image: imgLoadkingTruck,
      imageScale: 1.2,
      price: 'NPR 3,460,000',
      specs: {
        category: 'Medium Duty Cargo',
        payload: 'Up to 25T GVW',
        engine: 'mDi Tech CRDe',
        useCase: 'Cargo / Logistics',
      },
      gallery: loadkingTipperGallery,
      brochure: brochureOptimo,
    },
    {
      id: 'loadking-optimo-tipper-2.5',
      name: 'LoadKing Optimo Tipper 2.5',
      category: 'tipper',
      tagline: 'Built for the toughest sites.',
      image: imgLoadkingTipper,
      price: 'NPR 3,445,000',
      specs: {
        category: 'Medium Duty Tipper',
        payload: 'Up to 25T GVW',
        engine: 'mDi Tech CRDe',
        useCase: 'Construction / Quarry',
      },
      gallery: loadkingTipperGallery,
      brochure: brochureOptimo,
    },
    {
      id: 'supro-mini-vx',
      name: 'Supro Mini Profit Truck VX',
      category: 'light',
      tagline: 'Compact. Capable. Always on time.',
      image: imgSuproMini,
      cardImageScale: 1.4,
      detailImageScale: 1.0,
      price: 'NPR 2,215,000',
      specs: {
        category: 'Light Commercial',
        payload: '750 kg',
        engine: '909cc DI Diesel',
        useCase: 'Last-Mile Delivery',
      },
      gallery: suproMiniGallery,
      brochure: brochureSuproMini,
    },
    {
      id: 'supro-maxi-vx/lx',
      name: 'Supro Maxi Profit Truck VX/LX',
      category: 'light',
      tagline: 'More payload, more profit.',
      image: imgSuproMaxi,
      price: 'NPR 2,352,000',
      specs: {
        category: 'Light Commercial',
        payload: '900 kg',
        engine: 'mDi Tech Diesel',
        useCase: 'City Logistics',
      },
      gallery: suproMaxiGallery,
      brochure: brochureSuproMaxi,
    },
    {
      id: 'earthmaster-sx90',
      name: 'Mahindra EarthMaster SX90',
      category: 'construction',
      tagline: 'Power meets precision. 4WD backhoe loader.',
      image: imgEarthmasterSx90,
      detailImageScale: 1.0,
      price: 'Contact for pricing',
      specs: {
        category: 'Backhoe Loader',
        power: '90 HP CRDi',
        drive: '4WD',
        useCase: 'Heavy Construction',
      },
      gallery: earthmasterSX90Gallery,
      brochure: brochureEarthmaster,
    },
    {
      id: 'blazo x-tipper-m-dura 28',
      name: 'Blazo X Tipper m Dura 28',
      category: 'tipper',
      tagline: 'Heavy haulage with FuelSmart efficiency.',
      image: imgBlazoxTipperMDura,
      price: 'NPR 11,750,000',
      specs: {
        category: 'Heavy Duty Tipper',
        payload: 'Up to 35T',
        engine: 'mPower FuelSmart',
        useCase: 'Mining / Earthmoving',
      },
      gallery: blazoX35Gallery,
      brochure: brochureBlazo,
    },
    {
      id: 'blazo x-35-truck',
      name: 'Blazo X 35 Truck',
      category: 'truck',
      tagline: 'Long-haul cargo. Class-leading mileage.',
      image: imgBlazoX35,
      price: 'NPR 8,900,000',
      specs: {
        category: 'Heavy Duty Cargo',
        payload: 'Up to 35T GVW',
        engine: 'mPower FuelSmart',
        useCase: 'Long-Haul Logistics',
      },
      gallery: blazoX35Gallery,
      brochure: brochureBlazo,
    },
    {
      id: 'cruzio-grande-bus',
      name: 'Cruzio Grande Bus',
      category: 'bus',
      tagline: 'Long-distance comfort. Modern passenger transport.',
      image: imgCruzioGrande,
      cardImageScale: 1.5,
      price: 'NPR 6,200,000',
      specs: {
        category: 'Passenger Bus',
        payload: '40+ Seater',
        engine: 'mPower Diesel',
        useCase: 'Inter-City Travel',
      },
      gallery: cruzioGrandeGallery,
      brochure: brochureCruzioGrande,
    },
    {
      id: 'cruzio-school-bus',
      name: 'Cruzio School Bus',
      category: 'bus',
      tagline: 'Safe, reliable transport for students every day.',
      image: imgCruzioSchool,
      cardImageScale: 1.5,
      price: 'NPR 4,699,000',
      specs: {
        category: 'School Bus',
        payload: 'Up to 32 Seater',
        engine: 'mPower Diesel',
        useCase: 'Student Transport',
      },
      gallery: cruzioSchoolGallery,
      brochure: brochureCruzioGrande,
    },
  ];

  // Live catalog managed from the /admin portal. Vehicles come from the
  // Express + MongoDB backend; images are served by the same API.
  const [dbVehicles, setDbVehicles] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBase}/api/vehicles`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (cancelled || !data?.vehicles?.length) return;
        setDbVehicles(
          data.vehicles.map((v) => ({
            id: v.id,
            name: v.name,
            category: v.category,
            tagline: v.tagline,
            price: v.price,
            image: `${apiBase}${v.imageUrl}`,
            imageScale: v.imageScale ?? undefined,
            cardImageScale: v.cardImageScale ?? undefined,
            detailImageScale: v.detailImageScale ?? undefined,
            // Ordered [{label, value}] pairs — rendered via specsList below.
            specsList: v.specs,
            gallery: v.gallery.map((g) => ({ image: `${apiBase}${g.url}`, label: g.label })),
            brochure: v.brochureUrl ? `${apiBase}${v.brochureUrl}` : null,
          }))
        );
      })
      .catch(() => {}); // API down → keep the fallback list
    return () => {
      cancelled = true;
    };
  }, []);

  const vehicles = dbVehicles ?? fallbackVehicles;

  const filterCategories = [
    { key: 'all', labelKey: 'showcase.filter.all' },
    { key: 'truck', labelKey: 'showcase.filter.truck' },
    { key: 'tipper', labelKey: 'showcase.filter.tipper' },
    { key: 'light', labelKey: 'showcase.filter.light' },
    { key: 'construction', labelKey: 'showcase.filter.construction' },
    { key: 'bus', labelKey: 'showcase.filter.bus' },
  ];

  const filteredVehicles = filter === 'all'
    ? vehicles
    : vehicles.filter(v => v.category === filter);

  // Shared brochure modal — rendered on top of both list and detail views.
  const BrochureModal = brochureUrl ? (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={() => setBrochureUrl(null)}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-gray-900">
            <FileText className="w-4 h-4 text-[#e21b22]" />
            <span className="font-bold uppercase tracking-wider text-xs">
              {activeVehicle ? `${activeVehicle.name} — Brochure` : 'Brochure'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded transition-colors"
            >
              Open in new tab
            </a>
            <a
              href={brochureUrl}
              download
              className="text-xs font-bold uppercase tracking-wider bg-transparent border border-gray-800 text-gray-900 hover:bg-gray-950 hover:text-white hover:border-gray-950 px-3 py-1.5 rounded transition-colors"
            >
              Download
            </a>
            <button
              onClick={() => setBrochureUrl(null)}
              aria-label="Close brochure"
              className="text-gray-500 hover:text-gray-900 text-xl leading-none px-2"
            >
              ×
            </button>
          </div>
        </div>
        <iframe
          src={brochureUrl}
          title="Vehicle brochure"
          className="flex-1 w-full bg-gray-100"
        />
      </div>
    </div>
  ) : null;

  // ── Single-vehicle detail view ──
  if (activeVehicle) {
    const v = activeVehicle;
    // DB vehicles carry specs as an ordered list of {label, value}; the
    // fallback list still uses a plain object keyed by translation slug.
    const specEntries = v.specsList
      ? v.specsList.map((s) => [s.label, s.value])
      : Object.entries(v.specs || {});
    return (
      <>
        {BrochureModal}
        <div className="pb-20 bg-white text-gray-800 min-h-screen">
          {/* Title strip on white — minimal, no dark hero */}
          <section className="relative pt-[120px] pb-10 w-full">
            {/* Back button — pinned to the left edge of the page */}
            <button
              onClick={() => setActiveVehicle(null)}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-[0.25em] transition-colors mb-10 ml-6 lg:ml-10"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('showcase.back')}
            </button>
            <h1 className="font-black uppercase tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl text-gray-950 text-center max-w-5xl mx-auto px-6 lg:px-10">
              {v.name}
            </h1>

            {/* Price banner — shown for every vehicle. Falls back gracefully
              when a vehicle is marked "Contact for pricing". */}
            {v.price && (() => {
              const contactOnly = /contact/i.test(v.price);
              return (
                <div className="mt-8 flex justify-center px-6 lg:px-10">
                  <div className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-4 bg-gray-50 border border-gray-200 rounded-xl px-6 sm:px-8 py-4">
                    <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]">
                      {contactOnly ? 'Pricing' : 'Starting at'}
                    </span>
                    <span className={`font-black tracking-tight text-gray-950 ${contactOnly ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}>
                      {v.price}
                    </span>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Engineering / feature gallery — only renders when the vehicle
            has a gallery defined (BlazoX 35 Truck for now) */}
          {v.gallery && v.gallery.length > 0 && (() => {
            // When the last row has only 2 items (gallery length % 3 === 2),
            // use a 6-col grid so the orphan pair can be centered.
            const centerLastRow = v.gallery.length % 3 === 2;
            const gridColsClass = centerLastRow ? 'lg:grid-cols-6' : 'lg:grid-cols-3';
            const heroColSpanClass = centerLastRow ? 'lg:col-span-6' : 'lg:col-span-3';
            const itemColSpanClass = centerLastRow ? 'lg:col-span-2' : '';
            const lastRowStartIdx = v.gallery.length - 2;
            return (
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-5`}>
                  {/* Hero tile — the full vehicle photo as the gallery lead */}
                  <div className={`bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1 sm:col-span-2 ${heroColSpanClass}`}>
                    <div className="aspect-[16/8] overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={v.image}
                        alt={v.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                        style={{ transform: `scale(${v.detailImageScale != null ? v.detailImageScale : (v.imageScale || 1) * 1.6})` }}
                      />
                    </div>
                    <div className="px-5 py-4 border-t border-gray-100">
                      <p className="text-gray-950 text-sm font-black uppercase tracking-wide text-center">
                        {v.name}
                      </p>
                    </div>
                  </div>

                  {v.gallery.map((item, i) => (
                    <div
                      key={i}
                      className={`bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1 ${itemColSpanClass} ${centerLastRow && i === lastRowStartIdx ? 'lg:col-start-2' : ''}`}
                    >
                      <div className="aspect-[16/9] overflow-hidden bg-white">
                        <img
                          src={item.image}
                          alt={item.label}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="px-5 py-4 border-t border-gray-100">
                        <p className="text-gray-950 text-sm font-black uppercase tracking-wide text-center">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* Key specs callouts row */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
            <h2 className="text-center text-lg sm:text-2xl font-black uppercase tracking-[0.25em] text-[rgb(213,59,59)] mb-8">
              {t('showcase.keySpecs')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {specEntries.map(([key, value], i) => (
                <div
                  key={`${key}-${i}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 text-center"
                >
                  <p className="text-gray-950 text-sm sm:text-base font-black uppercase tracking-tight mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                    {value}
                  </p>
                  <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                    {t(specLabelKey[key] || key)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Detailed specs table */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
            <h3 className="text-gray-950 text-2xl sm:text-3xl font-black uppercase tracking-tight mb-6">
              {v.name}
            </h3>
            <div className="border-t border-gray-200">
              {specEntries.map(([key, value], i) => (
                <div
                  key={`${key}-${i}`}
                  className="flex justify-between items-center py-4 border-b border-gray-200 text-sm sm:text-base"
                >
                  <span className="text-gray-500 uppercase tracking-wider text-xs sm:text-sm font-bold">
                    {t(specLabelKey[key] || key)}
                  </span>
                  <span className="text-gray-950 font-semibold text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* CTAs — Book Test Drive + View Brochure */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage('booking')}
              className="inline-flex items-center gap-3 bg-transparent border border-gray-800 hover:bg-gray-950 hover:border-gray-950 text-gray-900 hover:text-white font-bold uppercase tracking-wider text-sm px-10 py-4 transition-all duration-300"
            >
              <span>{t('showcase.bookTestDrive')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {v.brochure && (
              <button
                onClick={() => setBrochureUrl(v.brochure)}
                className="inline-flex items-center gap-3 bg-transparent border border-gray-800 hover:bg-gray-950 text-gray-900 hover:text-white font-bold uppercase tracking-wider text-sm px-10 py-4 transition-all duration-300"
              >
                <FileText className="w-4 h-4" />
                <span>View Brochure</span>
              </button>
            )}
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      {BrochureModal}
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
              className={`px-6 py-2.5 rounded font-bold uppercase tracking-wider text-xs border transition-all duration-300 ${filter === key
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
                onClick={() => setActiveVehicle(vehicle)}
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] flex flex-col"
              >
                {/* Title at top */}
                <div className="px-6 pt-8 pb-2 text-center">
                  <h3 className="text-gray-950 text-xl font-black uppercase tracking-tight leading-tight">
                    {vehicle.name}
                  </h3>
                </div>

                {/* Image — fixed height so all vehicles render the same size.
                  An optional per-vehicle imageScale lets us compensate for
                  source images that have extra transparent padding. */}
                <div className="flex-grow flex items-center justify-center px-2 py-2 h-[460px] overflow-hidden">
                  <div style={{ transform: `scale(${vehicle.cardImageScale || vehicle.imageScale || 1})` }}>
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="h-[440px] w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Info strip at bottom */}
                <div className="px-6 py-5 border-t border-gray-100 text-center flex flex-col items-center">
                  <div className="inline-flex items-center gap-3 bg-transparent border border-gray-800 group-hover:bg-[#e21b22] group-hover:border-[#e21b22] text-gray-900 group-hover:text-white font-bold uppercase tracking-wider text-sm px-8 py-3 transition-all duration-300">
                    <span>{t('showcase.viewDetails')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
