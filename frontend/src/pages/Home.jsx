import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Compass, Zap, Milestone, Star, Quote } from 'lucide-react';
import { TOPO_CONTOUR_PATH } from '../utils/topoContour';
import { PAPER_BG_STYLE } from '../utils/paperTexture';
import { useT } from '../utils/i18n';
import untitledDesign4 from '../assets/Untitled design (4).jpg';
import blazoCargo from '../assets/mahindra-blazo-x-35-cargo.avif';
import blazoTipper from '../assets/blazo_tipper_upscaled.png';
import gallery3 from '../assets/gallery-3.jpg';
import earthmasterSxIv from '../assets/mahindra-earthmaster-sx-iv-1911306843.jpg';
import gallery1 from '../assets/gallery-1 (1).jpg';
import suproMiniTruck from '../assets/supro-mini-truck-front-view.png';
import smart50 from '../assets/Mahindra_SX_Smart_50_4_ab720f2044.webp';
import backhoeLoader from '../assets/mahindra-backhoe-loader-28-04-2022-2-271486210-zkd8fne7.avif';
import heavyMachineryImg from '../assets/desi-machines-mahindra-earthmaster-sx-backhoe-loader-featured-1.jpg';
import commercialSalesImg from '../assets/IMG_1565.jpg';
import sparePartsImg from '../assets/spareparts.jpg';
import busAlt from '../assets/gallery-111.jpg';
import loadkingOptimo from '../assets/mahindra-loadking-optimo-54629.avif';
import topSpeed70 from '../assets/70_kmph_top_speed.jpg';


// Slide text comes from i18n (keys: home.slide{N}.tag/headline/sub).
const slides = [
  { id: 0, image: untitledDesign4, objectPosition: 'center center' },
  { id: 1, image: blazoCargo, objectPosition: 'center center' },
  { id: 2, image: blazoTipper, objectPosition: 'center center' },
  { id: 3, image: gallery3, objectPosition: 'center center' },
  { id: 4, image: earthmasterSxIv, objectPosition: 'center center' },
  { id: 5, image: loadkingOptimo, objectPosition: 'center center' },
  { id: 6, image: topSpeed70, objectPosition: 'center center' },
];

const INTERVAL_MS = 5000;

const faqs = [
  {
    question: "How can I book a test drive for a Mahindra vehicle?",
    answer: "You can easily schedule a test drive by visiting our Booking page, selecting your preferred vehicle type (Commercial or Passenger), and providing your contact information. Our representative will contact you to confirm details."
  },
  {
    question: "What are the key benefits of Mahindra FuelSmart technology?",
    answer: "Our FuelSmart engines are designed to maximize mileage under varying load conditions. With switchable driving modes (Turbo, Heavy, Light), drivers can tune the engine performance to real-time cargo demand, leading to significant fuel savings."
  },
  {
    question: "Where can I purchase genuine Mahindra spare parts?",
    answer: "Genuine Mahindra spare parts can be purchased directly from any of our authorized dealerships and service centers. Using genuine parts ensures optimal vehicle life, maximum safety, and maintains your warranty."
  },
  {
    question: "What telematics solutions do Mahindra commercial vehicles support?",
    answer: "We equip our modern truck fleets with Mahindra DigiSense, a cloud-based telematics platform that offers real-time vehicle tracking, fuel monitoring, geo-fencing, and driver behavior analysis."
  },
  {
    question: "Does Mahindra offer custom financing options for fleets?",
    answer: "Yes, Mahindra Finance offers tailored financing and loan structures for fleet buyers, commercial operators, and individual buyers, ensuring low interest rates and convenient repayment options."
  }
];

// Crossfading image panel for the divisions block. When the tab provides
// multiple images (tab.imgs), shows prev/next arrows and dot indicators.
function TabImage({ tab }) {
  const imgs = tab.imgs && tab.imgs.length > 0 ? tab.imgs : [tab.img];
  const [idx, setIdx] = useState(0);
  const hasMany = imgs.length > 1;
  useEffect(() => {
    setIdx(0);
    if (!hasMany) return undefined;
    const id = setInterval(() => setIdx((i) => (i + 1) % imgs.length), 4000);
    return () => clearInterval(id);
  }, [tab.label, imgs.length, hasMany]);
  const go = (delta) => setIdx((i) => (i + delta + imgs.length) % imgs.length);
  return (
    <>
      {imgs.map((src, i) => (
        <img
          key={`${tab.label}-${i}`}
          src={src}
          alt={tab.label}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
      {hasMany && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-6 right-6 flex items-center gap-2">
            {imgs.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function Home({ setCurrentPage }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [fading, setFading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('heavy');
  const t = useT();

  const goTo = useCallback((index) => {
    if (index === current || fading) return;
    setPrev(current);
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setPrev(null);
      setFading(false);
    }, 700);
  }, [current, fading]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const previous = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];
  const prevSlide = prev !== null ? slides[prev] : null;

  return (
    <div className="bg-mahindra-black text-gray-800">
      {/* ── Hero Slideshow ── */}
      <section
        className="relative h-screen flex flex-col justify-center bg-black overflow-hidden"
        id="hero-section"
      >
        {/* Slideshow Images with Smooth Cross-Fade */}
        {slides.map((s, idx) => (
          <img
            key={s.id}
            src={s.image}
            alt={t(`home.slide${s.id}.tag`)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
            style={{
              objectPosition: s.objectPosition || 'center center',
              transform: 'scale(1.05)',
              opacity: idx === current ? 1 : 0,
              zIndex: idx === current ? 2 : 1,
            }}
          />
        ))}

        {/* Dark overlay — base tint + radial focus where the text sits so the
            headline stays readable against busy backgrounds. */}
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 45% at 50% 55%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 80%)',
          }}
        />

        {/* Bottom-anchored content — Kia-style minimal hero */}
        <div className="w-full px-4 z-20 relative flex items-center justify-center">
          <div className="max-w-3xl text-center space-y-4">
            {/* Headline — compact, single-line preferred */}
            <h1
              key={`h1-${slide.id}`}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] whitespace-pre-line"
              style={{
                animation: 'slideUp 0.7s ease 0.1s both',
                textShadow: '0 2px 16px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.6)',
              }}
            >
              {t(`home.slide${slide.id}.headline`)}
            </h1>

            {/* Sub-text — short tagline */}
            <p
              key={`sub-${slide.id}`}
              className="text-base sm:text-lg lg:text-xl leading-relaxed font-light max-w-2xl mx-auto text-gray-200"
              style={{
                animation: 'slideUp 0.7s ease 0.2s both',
                textShadow: '0 1px 8px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.55)',
              }}
            >
              {t(`home.slide${slide.id}.sub`)}
            </p>

          </div>
        </div>

        {/* Arrow controls */}
        <button
          id="slide-prev"
          onClick={previous}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/30 bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          id="slide-next"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/30 bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-30">
          <div
            key={`progress-${current}`}
            className="h-full bg-mahindra-red"
            style={{ animation: `progress ${INTERVAL_MS}ms linear forwards` }}
          />
        </div>
      </section>

      {/* ── What We Do Section ── */}
      <section className="py-24 bg-white text-gray-800 relative overflow-hidden" id="what-we-do-section">
        {/* Topographic contour pattern (real iso-contours, marching squares) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
          <path d={TOPO_CONTOUR_PATH} stroke="#d4d4d4" strokeWidth="0.7" fill="none" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          {/* Header */}
          <div className="mb-16 text-center space-y-2">
            <span className="text-[#e21b22] font-black uppercase tracking-[0.25em] text-xl sm:text-2xl block">
              {t('home.whatWeDo.eyebrow')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none font-sans whitespace-pre-line">
              {t('home.whatWeDo.title')}
            </h2>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Commercial Vehicle Sales',
                desc: 'Authorised dealer for Mahindra commercial trucks, passenger vehicles, and light commercials serving individuals and fleet operators across Nepal.',
                img: commercialSalesImg,
                imgFilter: 'brightness(0.85) contrast(1.05)',
                page: 'showcase',
              },
              {
                num: '02',
                title: 'Service & Spare Parts',
                desc: 'Country wide service network with genuine parts, trained technicians, and scheduled visits. We do not disappear after delivery — we stay with the vehicle, for the long haul.',
                img: sparePartsImg,
                imgPosition: 'center 70%',
                page: 'booking',
              },
              {
                num: '03',
                title: 'Heavy Machinery',
                desc: 'Authorised distributor for Mahindra Heavy Commercial Vehicles, Light Commercial Vehicles, Small Commercial Vehicles and Buses.',
                img: heavyMachineryImg,
                imgPosition: 'center',
                page: 'showcase',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
              >
                {/* Image */}
                <div className="overflow-hidden h-56">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{
                      ...(card.imgFilter ? { filter: card.imgFilter } : null),
                      ...(card.imgPosition ? { objectPosition: card.imgPosition } : null),
                    }}
                  />
                </div>
                {/* Content */}
                <div className="px-8 pt-7 pb-7">
                  <span className="text-[#e21b22] text-sm font-black block mb-3">{card.num}</span>
                  <h3 className="text-gray-950 text-xl font-black uppercase tracking-tight leading-tight mb-4">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Divisions Showcase ── */}
      {(() => {
        const divisions = {
          heavy: {
            label: 'Heavy Duty Trucks',
            tag: 'Long Haul & Fleet',
            headline: 'Engineered for the Long Road.',
            desc: 'Mahindra\'s Blazo X series redefines heavy cargo operations with class-leading fuel efficiency, intelligent FuelSmart switching modes, and a driver-first cabin built for thousands of kilometres.',
            img: blazoCargo,
            stats: [
              { label: 'Max GVW', value: '49,000 kg' },
              { label: 'Engine Power', value: '280 HP' },
              { label: 'Max Torque', value: '1,050 Nm' },
              { label: 'FuelSmart Modes', value: '3 Modes' },
            ],
            cta: 'View Heavy Trucks',
            page: 'showcase',
          },
          tipper: {
            label: 'Tipper',
            tag: 'Earthmoving & Quarrying',
            headline: 'Built for the Toughest Sites.',
            desc: 'From quarry faces to city infrastructure, the Blazo X Tipper and EarthMaster backhoe loaders deliver raw torque, precision telematics (DigiSense), and lowest fuel burn in class.',
            img: blazoTipper,
            stats: [
              { label: 'Max Load', value: '35 Tonnes' },
              { label: 'Dig Depth', value: '4.88 m' },
              { label: 'Bucket Cap.', value: '1.1 m³' },
              { label: 'Telematics', value: 'DigiSense' },
            ],
            cta: 'View Construction Fleet',
            page: 'showcase',
          },
          light: {
            label: 'Small Commercials',
            tag: 'Last-Mile & City Logistics',
            headline: 'Smart. Agile. Always On Time.',
            desc: 'The Supro Mini Truck and Cargo range are purpose-built for urban last-mile delivery — compact enough for narrow city roads, strong enough to carry a full commercial payload every single day.',
            img: suproMiniTruck,
            stats: [
              { label: 'Payload Cap.', value: '900 kg' },
              { label: 'Engine', value: '909cc DI' },
              { label: 'Power', value: '26 HP' },
              { label: 'Fuel Option', value: 'Diesel / CNG' },
            ],
            cta: 'View Light Commercials',
            page: 'showcase',
          },
          bus: {
            label: 'Buses',
            tag: 'Passenger Transport',
            headline: 'Safe Journeys, Every Day.',
            desc: 'Mahindra school buses are built with passenger safety at the core — featuring ABS, fire detection systems, and a robust 2.5L mDI CRDe engine designed for reliable daily school runs across Nepal.',
            img: gallery3,
            stats: [
              { label: 'Seating', value: '32 + Driver' },
              { label: 'Engine', value: '2.5L mDI CRDe' },
              { label: 'Power', value: '120 HP' },
              { label: 'Safety', value: 'ABS & Fire Det.' },
            ],
            cta: 'Book a Test Drive',
            page: 'booking',
            imgs: [gallery3, busAlt],
          },
          earthmaster: {
            label: 'Construction Equipment',
            tag: 'Heavy Construction',
            headline: 'Power Meets Precision.',
            desc: 'The Mahindra EarthMaster SX backhoe loader delivers class-leading dig depth, high breakout force, and DigiSense telematics — engineered for Nepal\'s most demanding construction and quarrying projects.',
            img: backhoeLoader,
            stats: [
              { label: 'Engine', value: '74 HP CRDI' },
              { label: 'Dig Depth', value: '4.88 m' },
              { label: 'Bucket Cap.', value: '1.1 m³' },
              { label: 'Telematics', value: 'DigiSense' },
            ],
            cta: 'View EarthMaster',
            page: 'showcase',
          },
        };
        const tab = divisions[activeTab];
        return (
          <section className="py-24 text-gray-800 overflow-hidden relative" id="services-section" style={PAPER_BG_STYLE}>
            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
              {/* Header */}
              <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                  <span className="text-[#e21b22] font-black uppercase tracking-[0.25em] text-xl sm:text-2xl block">
                    {t('home.divisions.eyebrow')}
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none font-sans whitespace-pre-line">
                    {t('home.divisions.title')}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm sm:text-base max-w-sm leading-relaxed font-light text-left md:text-right">
                  Select a division to explore its fleet, specifications, and commercial advantages.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex overflow-x-auto justify-center gap-3 mb-12 border-b border-gray-200 pb-0 scrollbar-none">
                {Object.entries(divisions).map(([key, div]) => (
                  <button
                    key={key}
                    id={`tab-${key}`}
                    onClick={() => setActiveTab(key)}
                    className={`pb-4 px-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all duration-300 ${activeTab === key
                      ? 'border-[#e21b22] text-[#e21b22]'
                      : 'border-transparent text-gray-400 hover:text-gray-800 hover:border-gray-300'
                      }`}
                  >
                    {div.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Content Panel */}
            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 items-center">
                {/* Left: Info & Stats */}
                <div className="space-y-6">
                  <span className="inline-block bg-[#e21b22] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                    {tab.tag}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight leading-tight">
                    {tab.headline}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    {tab.desc}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {tab.stats.map((s) => (
                      <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block mb-1">{s.label}</span>
                        <span className="text-gray-950 text-xl font-black">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    id={`tab-cta-${activeTab}`}
                    onClick={() => setCurrentPage(tab.page)}
                    className="inline-flex items-center gap-3 bg-transparent border border-gray-800 hover:bg-[#e21b22] hover:border-[#e21b22] text-gray-900 hover:text-white font-bold uppercase tracking-wider text-sm px-8 py-4 transition-all duration-300"
                  >
                    {tab.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Vehicle Image */}
                <div className="relative h-[540px] rounded-2xl overflow-hidden shadow-xl">
                  <TabImage tab={tab} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest block">Division</span>
                    <span className="text-white text-2xl font-black uppercase">{tab.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}



      {/* Keyframe styles */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes marqueeRtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          overflow: hidden;
          width: 100%;
        }
        .marquee-track {
          display: flex;
          width: max-content;
          gap: 2rem;
          animation: marqueeRtl 45s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>


      {/* ── Client Reviews Section ── */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100" id="reviews-section">
        {/* Topographic contour pattern (real iso-contours, marching squares) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
          <path d={TOPO_CONTOUR_PATH} stroke="#d4d4d4" strokeWidth="0.7" fill="none" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="text-[#e21b22] font-black uppercase tracking-[0.25em] text-xl sm:text-2xl block">
              {t('home.reviews.eyebrow')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none font-sans">
              {t('home.reviews.title')}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
              See how our high-performance vehicles and dedicated servicing empower businesses across the nation.
            </p>
          </div>
        </div>

        {/* Reviews Marquee Track */}
        <div className="marquee-container py-4">
          <div className="marquee-track">
            {[
              {
                name: 'Rajesh Khanna',
                role: 'Fleet Operator, Khanna Logistics',
                quote: "Mahindra's Blazo X series has reduced our fuel expenses by 12% in just six months. The telematics suite makes tracking assets incredibly simple.",
                rating: 5,
                initials: 'RK',
              },
              {
                name: 'Amit Sharma',
                role: 'Construction Lead, InfraBuild Corp',
                quote: "The EarthMaster Backhoe loaders are built for the toughest sites. Zero unexpected downtime and great load capacity.",
                rating: 5,
                initials: 'AS',
              },
              {
                name: 'Vikram Adhikari',
                role: 'Logistics Manager, Express Delivery',
                quote: "Supro Mini Trucks are perfect for last-mile delivery. Maneuverability in narrow streets is exceptional, and maintenance is minimal.",
                rating: 5,
                initials: 'VA',
              },
              {
                name: 'Sunita Deshmukh',
                role: 'Owner, Deshmukh Transports',
                quote: "Exceptional engine reliability on the Furio range. Driver cabin comfort is best in class for long-distance hauling.",
                rating: 5,
                initials: 'SD',
              },
              {
                name: 'Karan Johar',
                role: 'MD, K.J. Infrastructures',
                quote: "The Mahindra tippers have revamped our quarry operations. Strong suspension, great mileage, and rugged durability are unmatched.",
                rating: 5,
                initials: 'KJ',
              },
              {
                name: 'Rohan Verma',
                role: 'Supply Chain Director, Apex Goods',
                quote: "Excellent dealership support and transparent cost of ownership. Mahindra commercial vehicles are the backbone of our operations.",
                rating: 5,
                initials: 'RV',
              },
            ].concat([
              {
                name: 'Rajesh Khanna',
                role: 'Fleet Operator, Khanna Logistics',
                quote: "Mahindra's Blazo X series has reduced our fuel expenses by 12% in just six months. The telematics suite makes tracking assets incredibly simple.",
                rating: 5,
                initials: 'RK',
              },
              {
                name: 'Amit Sharma',
                role: 'Construction Lead, InfraBuild Corp',
                quote: "The EarthMaster Backhoe loaders are built for the toughest sites. Zero unexpected downtime and great load capacity.",
                rating: 5,
                initials: 'AS',
              },
              {
                name: 'Vikram Adhikari',
                role: 'Logistics Manager, Express Delivery',
                quote: "Supro Mini Trucks are perfect for last-mile delivery. Maneuverability in narrow streets is exceptional, and maintenance is minimal.",
                rating: 5,
                initials: 'VA',
              },
              {
                name: 'Sunita Deshmukh',
                role: 'Owner, Deshmukh Transports',
                quote: "Exceptional engine reliability on the Furio range. Driver cabin comfort is best in class for long-distance hauling.",
                rating: 5,
                initials: 'SD',
              },
              {
                name: 'Karan Johar',
                role: 'MD, K.J. Infrastructures',
                quote: "The Mahindra tippers have revamped our quarry operations. Strong suspension, great mileage, and rugged durability are unmatched.",
                rating: 5,
                initials: 'KJ',
              },
              {
                name: 'Rohan Verma',
                role: 'Supply Chain Director, Apex Goods',
                quote: "Excellent dealership support and transparent cost of ownership. Mahindra commercial vehicles are the backbone of our operations.",
                rating: 5,
                initials: 'RV',
              },
            ]).map((review, idx) => (
              <div
                key={idx}
                className="bg-[#f8f9fa] border border-black/5 rounded-xl p-6 hover:border-[#e21b22]/30 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between shadow-sm relative group text-left w-[300px] sm:w-[350px] flex-shrink-0"
              >
                <div className="absolute top-6 right-6 text-gray-200 group-hover:text-[#e21b22]/10 transition-colors duration-300">
                  <Quote className="w-8 h-8 transform rotate-180" />
                </div>

                <div className="space-y-3">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed italic relative z-10 pt-1">
                    "{review.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-gray-950 font-bold text-sm uppercase tracking-wider">{review.name}</h4>
                    <p className="text-gray-400 text-xs">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Reviews on Google CTA */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-14 flex justify-center relative z-10">
          <a
            href="https://www.google.com/search?q=Dugar+Auto+Clinic+Kathmandu+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black hover:bg-[#e21b22] text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded transition-colors duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.7 9 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 34.5 26.7 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.6 39 16.2 43.5 24 43.5z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.2 5.2C41.2 35.5 43.5 30.1 43.5 24c0-1.2-.1-2.4-.4-3.5z" />
            </svg>
            <span>{t('home.reviews.googleCta')}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-24 text-gray-800 border-t border-gray-100 bg-[#FAF7F2]" id="faq-section">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="text-[#e21b22] font-black uppercase tracking-[0.25em] text-lg sm:text-xl block">
              {t('home.faq.eyebrow')}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none font-sans">
              {t('home.faq.title')}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
              Find quick answers to common inquiries about our heavy-duty vehicles, booking procedures, and custom servicing options.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-colors duration-300 hover:border-gray-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-gray-950 hover:text-[#e21b22] transition-colors duration-200 cursor-pointer bg-white"
                  >
                    <span className="text-base sm:text-lg uppercase tracking-tight">{faq.question}</span>
                    <span className="ml-4 flex-shrink-0 text-xl font-light text-gray-400 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                      +
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div className="p-6 pt-0 text-gray-650 text-sm sm:text-base leading-relaxed font-normal border-t border-gray-150 bg-neutral-50/50">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div >
  );
}
