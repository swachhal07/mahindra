import React, { useState, useEffect, useCallback } from 'react';

// Paper-grain texture: cream tones baked directly into the noise so no blend mode is needed.
// Paint becomes a plain bitmap blit — no per-pixel blend computation when content reflows.
// Single feTurbulence with 4 octaves captures both fine fibers and coarse specks in one pass.
const PAPER_TEXTURE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' seed='5' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0.22 0.78  0 0 0 0.22 0.76  0 0 0 0.22 0.72  0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const PAPER_BG_STYLE = {
  backgroundColor: '#FAF7F2',
  backgroundImage: PAPER_TEXTURE,
  backgroundSize: '600px 600px',
  backgroundRepeat: 'repeat',
};

// Topographic contour path generated via marching squares over a heightmap of Gaussian peaks.
// Produces real iso-contours: closed loops around peaks, flowing lines through slopes.
const TOPO_CONTOUR_PATH = (() => {
  const peaks = [
    { x: 230,  y: 220, h: 1.4, r: 230 },
    { x: 720,  y: 320, h: 1.5, r: 260 },
    { x: 1230, y: 240, h: 1.2, r: 200 },
    { x: 420,  y: 720, h: 1.3, r: 240 },
    { x: 1050, y: 700, h: 1.4, r: 250 },
  ];
  const heightAt = (x, y) => {
    let h = 0;
    for (const p of peaks) {
      const dx = x - p.x, dy = y - p.y;
      h += p.h * Math.exp(-(dx * dx + dy * dy) / (p.r * p.r));
    }
    return h;
  };

  const W = 1440, H = 900, cell = 14;
  const cols = Math.ceil(W / cell);
  const rows = Math.ceil(H / cell);
  const grid = new Float32Array((cols + 1) * (rows + 1));
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      grid[r * (cols + 1) + c] = heightAt(c * cell, r * cell);
    }
  }

  const levels = [0.06, 0.13, 0.21, 0.30, 0.40, 0.51, 0.63, 0.76, 0.90, 1.05];
  let d = '';
  for (const level of levels) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = c * cell, y0 = r * cell;
        const tl = grid[r * (cols + 1) + c];
        const tr = grid[r * (cols + 1) + c + 1];
        const br = grid[(r + 1) * (cols + 1) + c + 1];
        const bl = grid[(r + 1) * (cols + 1) + c];
        const code = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
        if (code === 0 || code === 15) continue;
        const top    = () => [x0 + cell * (level - tl) / (tr - tl), y0];
        const right  = () => [x0 + cell, y0 + cell * (level - tr) / (br - tr)];
        const bottom = () => [x0 + cell * (level - bl) / (br - bl), y0 + cell];
        const left   = () => [x0, y0 + cell * (level - tl) / (bl - tl)];
        let pairs;
        switch (code) {
          case 1:  pairs = [[left(), bottom()]]; break;
          case 2:  pairs = [[bottom(), right()]]; break;
          case 3:  pairs = [[left(), right()]]; break;
          case 4:  pairs = [[top(), right()]]; break;
          case 5:  pairs = [[top(), right()], [left(), bottom()]]; break;
          case 6:  pairs = [[top(), bottom()]]; break;
          case 7:  pairs = [[top(), left()]]; break;
          case 8:  pairs = [[top(), left()]]; break;
          case 9:  pairs = [[top(), bottom()]]; break;
          case 10: pairs = [[top(), left()], [bottom(), right()]]; break;
          case 11: pairs = [[top(), right()]]; break;
          case 12: pairs = [[left(), right()]]; break;
          case 13: pairs = [[bottom(), right()]]; break;
          case 14: pairs = [[left(), bottom()]]; break;
        }
        for (const [[x1, y1], [x2, y2]] of pairs) {
          d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
        }
      }
    }
  }
  return d;
})();
import { ArrowRight, ChevronLeft, ChevronRight, Compass, Zap, Milestone, Star, Quote } from 'lucide-react';
import untitledDesign4 from '../assets/Untitled design (4).jpg';
import blazoCargo from '../assets/mahindra-blazo-x-35-cargo.avif';
import blazoTipper from '../assets/blazo_tipper_upscaled.png';
import gallery3 from '../assets/gallery-3.jpg';
import earthmasterSxIv from '../assets/mahindra-earthmaster-sx-iv-1911306843.jpg';
import gallery1 from '../assets/gallery-1 (1).jpg';
import suproMiniTruck from '../assets/supro-mini-truck-front-view.png';
import smart50 from '../assets/Mahindra_SX_Smart_50_4_ab720f2044.webp';
import backhoeLoader from '../assets/mahindra-backhoe-loader-28-04-2022-2-271486210-zkd8fne7.avif';


const slides = [
  {
    id: 0,
    image: untitledDesign4,
    tag: 'Heavy Haulage',
    headline: 'Logistics You Can\nCount On, Start to Finish.',
    sub: 'We specialise in heavy commercial trucking, premium haulage solutions, and high-performance engineering built for any terrain.',
    cta: { label: 'Book Test Drive', page: 'booking' },
    secondary: { label: 'View Showcase', page: 'showcase' },
    objectPosition: 'center center',
  },
  {
    id: 1,
    image: blazoCargo,
    tag: 'Cargo & Logistics',
    headline: 'Maximise Profits.\nMinimise Downtime.',
    sub: 'High-payload cargo solutions designed for optimal mileage and effortless long-distance operations across the country.',
    cta: { label: 'Book Test Drive', page: 'booking' },
    secondary: { label: 'View Showcase', page: 'showcase' },
    objectPosition: 'center center',
  },
  {
    id: 2,
    image: blazoTipper,
    tag: 'Tipper Efficiency',
    headline: 'Power That Moves\nIndustries Forward.',
    sub: 'The Mahindra Blazo X Tipper redefines long-haul efficiency with intelligent fuel management and class-leading reliability.',
    cta: { label: 'Book Test Drive', page: 'booking' },
    secondary: { label: 'View Showcase', page: 'showcase' },
    objectPosition: 'center center',
  },
  {
    id: 3,
    image: gallery3,
    tag: 'Next-Gen Commercials',
    headline: 'Next-Gen Efficiency,\nBuilt For Tomorrow.',
    sub: 'Redefining the heavy commercial segment with high-productivity features and world-class driver comfort.',
    cta: { label: 'Book Test Drive', page: 'booking' },
    secondary: { label: 'View Showcase', page: 'showcase' },
    objectPosition: 'center center',
  },
  {
    id: 4,
    image: earthmasterSxIv,
    tag: 'Smart Construction',
    headline: 'Smart Technology.\nPrecision Performance.',
    sub: 'Advanced earthmoving machinery engineered for maximum output, lowest fuel consumption, and absolute durability.',
    cta: { label: 'Book Test Drive', page: 'booking' },
    secondary: { label: 'View Showcase', page: 'showcase' },
    objectPosition: 'center center',
  },
];

const INTERVAL_MS = 5000;

const faqs = [
  {
    question: "How can I book a test drive for a Mahindra vehicle?",
    answer: "You can easily schedule a test drive by visiting our Booking page, selecting your preferred vehicle type (Commercial, Passenger, or Agri-Tech), and providing your contact information. Our representative will contact you to confirm details."
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

export default function Home({ setCurrentPage }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [fading, setFading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('heavy');

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
        className="relative h-screen flex flex-col justify-between bg-black overflow-hidden"
        id="hero-section"
      >
        {/* Slideshow Images with Smooth Cross-Fade */}
        {slides.map((s, idx) => (
          <img
            key={s.id}
            src={s.image}
            alt={s.tag}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
            style={{
              objectPosition: s.objectPosition || 'center center',
              transform: 'scale(1.05)',
              opacity: idx === current ? 1 : 0,
              zIndex: idx === current ? 2 : 1,
            }}
          />
        ))}



        {/* Overlays */}
        <div className="absolute inset-0 bg-black/55 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 z-10" />

        {/* Navbar spacer */}
        <div className="h-[68px] w-full flex-shrink-0 relative z-20" />

        {/* Centered Content */}
        <div className="w-full px-4 z-20 relative flex-grow flex items-center justify-center">
          <div className="max-w-3xl text-center space-y-5">
            {/* Tag badge */}
            <div
              key={`tag-${slide.id}`}
              className="inline-block bg-mahindra-red text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded"
              style={{ animation: 'slideUp 0.6s ease forwards' }}
            >
              {slide.tag}
            </div>

            {/* Headline */}
            <h1
              key={`h1-${slide.id}`}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] whitespace-pre-line"
              style={{ animation: 'slideUp 0.7s ease 0.1s both' }}
            >
              {slide.headline}
            </h1>

            {/* Sub-text */}
            <p
              key={`sub-${slide.id}`}
              className="text-gray-300 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto"
              style={{ animation: 'slideUp 0.7s ease 0.2s both' }}
            >
              {slide.sub}
            </p>

            {/* CTAs */}
            <div
              key={`cta-${slide.id}`}
              className="flex items-center justify-center gap-4 pt-2"
              style={{ animation: 'slideUp 0.7s ease 0.3s both' }}
            >
              <button
                id={`hero-cta-primary-${slide.id}`}
                onClick={() => setCurrentPage(slide.cta.page)}
                className="flex items-center gap-3 bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-lg hover:scale-105 active:scale-100"
              >
                <span>{slide.cta.label}</span>
                <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
              <button
                id={`hero-cta-secondary-${slide.id}`}
                onClick={() => setCurrentPage(slide.secondary.page)}
                className="text-white font-semibold px-6 py-3 rounded-full border border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-100"
              >
                {slide.secondary.label}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: stats + dot nav */}
        <div className="w-full z-20 py-6 relative">
          {/* Dot navigation */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((s, i) => (
              <button
                key={s.id}
                id={`slide-dot-${i}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === current ? '28px' : '8px',
                  height: '8px',
                  background: i === current ? '#e8002d' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-16 sm:gap-24">
            <div className="text-center">
              <span className="text-white text-3xl sm:text-4xl font-extrabold block">100+</span>
              <span className="text-gray-400 text-xs sm:text-sm mt-1 block font-medium">Countries Present</span>
            </div>
            <div className="text-center">
              <span className="text-white text-3xl sm:text-4xl font-extrabold block">260K+</span>
              <span className="text-gray-400 text-xs sm:text-sm mt-1 block font-medium">Employees Globally</span>
            </div>
            <div className="text-center">
              <span className="text-white text-3xl sm:text-4xl font-extrabold block">150K+</span>
              <span className="text-gray-400 text-xs sm:text-sm mt-1 block font-medium">Tons Hauled Yearly</span>
            </div>
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
              WHAT WE DO
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none font-sans">
              POWERING INDIA'S<br />COMMERCIAL BACKBONE.
            </h2>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Vehicle Sales',
                desc: 'Authorised dealer for Mahindra commercial trucks, passenger vehicles, and light commercials — serving individuals and fleet operators across Kathmandu.',
                img: blazoCargo,
                page: 'showcase',
              },
              {
                num: '02',
                title: 'Service & Spare Parts',
                desc: 'Authorised service centre with genuine Mahindra spare parts and certified technicians ensuring maximum uptime for your vehicle.',
                img: earthmasterSxIv,
                page: 'booking',
              },
              {
                num: '03',
                title: 'Heavy Machinery',
                desc: 'Supply and support of heavy construction machinery including tippers, backhoe loaders, and earthmoving equipment built for Nepal\'s toughest terrain.',
                img: blazoTipper,
                page: 'showcase',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
                onClick={() => setCurrentPage(card.page)}
              >
                {/* Image */}
                <div className="overflow-hidden h-56">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Content */}
                <div className="p-8">
                  <span className="text-[#e21b22] text-sm font-black block mb-3">{card.num}</span>
                  <h3 className="text-gray-950 text-xl font-black uppercase tracking-tight leading-tight mb-4">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light mb-6">
                    {card.desc}
                  </p>
                  <div className="flex items-center gap-2 text-[#e21b22] font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                    <span>LEARN MORE</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
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
            label: 'Tippers & Construction',
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
            label: 'Light Commercials',
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
            label: 'School Buses',
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
          },
          earthmaster: {
            label: 'EarthMaster Backhoe',
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
                    OUR DIVISIONS
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none font-sans">
                    VEHICLES ENGINEERED<br />TO PERFORM.
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
                    className={`pb-4 px-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all duration-300 ${
                      activeTab === key
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
                  <img
                    key={activeTab}
                    src={tab.img}
                    alt={tab.label}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                  />
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
              CLIENT REVIEWS
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none font-sans">
              TRUSTED BY THE FLEET OWNERS.
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
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-24 bg-[#FAF7F2] text-gray-800 border-t border-gray-100" id="faq-section">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="text-[#e21b22] font-black uppercase tracking-[0.25em] text-lg sm:text-xl block">
              QUESTIONS &amp; ANSWERS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none font-sans">
              FREQUENTLY ASKED QUESTIONS.
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
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:border-gray-300"
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
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                      maxHeight: isOpen ? '250px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="p-6 pt-0 text-gray-650 text-sm sm:text-base leading-relaxed font-normal border-t border-gray-150 bg-neutral-50/50">
                      {faq.answer}
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
