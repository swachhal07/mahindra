import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Calendar, User } from 'lucide-react';
import { useT } from '../utils/i18n';
import blazoCargo from '../assets/mahindra-blazo-x-35-cargo.avif';
import blazoTipper from '../assets/blazo_tipper_upscaled.png';
import earthmaster from '../assets/mahindra-earthmaster-sx-iv-1911306843.jpg';
import suproMini from '../assets/supro-mini-truck-front-view.png';

// Placeholder posts. Real content can replace these; the structure
// (id / slug / title / excerpt / body paragraphs / date / author /
// category / image) stays the same.
const posts = [
  {
    id: 'fuelsmart-explained',
    slug: 'fuelsmart-explained',
    title: 'FuelSmart Technology Explained: How Blazo X Saves Diesel',
    excerpt: "Mahindra's FuelSmart switching modes (Turbo, Heavy, Light) let drivers match engine output to real-time load. Here's how it actually moves the mileage needle.",
    body: [
      "Fuel is the single largest line item in any heavy commercial operation in Nepal. Even a 5% improvement in mileage compounds into significant savings over a vehicle's life. Mahindra's FuelSmart engine technology, fitted across the Blazo X range, tackles this directly.",
      "FuelSmart engines support three switchable driving modes. Turbo mode delivers maximum power for steep climbs and full loads. Heavy mode balances power and efficiency for typical highway haulage. Light mode tunes the engine for empty return runs and city operations, where pulling Turbo power would waste diesel.",
      "Drivers select the mode via a switch on the dashboard. The ECU then re-maps fuel injection timing and turbo boost pressure for the selected profile. In field testing on the Birgunj–Kathmandu route, switching to Light on empty returns yielded 8–12% better mileage versus running Heavy throughout.",
      "The system is mechanical-electronic, not software-only. There's nothing to install or update. Fleet operators who train drivers to switch modes by trip phase typically see the biggest fuel savings in months one through three, then stable lower-burn operations from there.",
    ],
    date: '2026-05-22',
    author: 'Dugar Auto Clinic Team',
    category: 'Technology',
    image: blazoCargo,
  },
  {
    id: 'tipper-vs-cargo',
    slug: 'choosing-tipper-vs-cargo',
    title: "Tipper or Cargo Truck? Choosing the Right Mahindra for Your Site",
    excerpt: "Construction operators often pick by chassis size alone — but tipper geometry, dump-bed angle, and axle layout matter more for your specific work. A buyer's framework.",
    body: [
      "The first question we ask every construction buyer who walks into the showroom is simple: what does the vehicle actually do, hour by hour, during a typical shift? The answer almost always reveals whether a tipper or a cargo platform is the right call — regardless of which feels more 'rugged' on paper.",
      "Tippers are purpose-built for one motion: lift the bed, dump the load, drop the bed. The hydraulics, frame reinforcement, and bed geometry are all optimized for this. The Mahindra Blazo X m-DURA Tipper and LoadKing Optimo Tipper 25 are both designed around quarry, mine, and aggregate-dumping cycles where the truck unloads multiple times per shift.",
      "Cargo trucks (Blazo X 35 Truck, LoadKing Optimo Truck 25) carry payload over distance with manual or forklift unloading at the destination. The bed is fixed, the frame is tuned for sustained highway speeds, and the gearing favours fuel economy at cruise.",
      "The mismatch we see most often: an operator buys a tipper for general transport because it 'looks tougher,' then never uses the dump mechanism. They pay for hydraulics they don't need, carry less payload than a cargo truck of the same chassis class would, and burn more diesel hauling unused equipment weight. The reverse mistake — buying a cargo truck for a dumping operation — wears out the bed and frame within 18 months.",
      "Our rule of thumb: if the truck dumps its load more than once a week, buy a tipper. If it's pallets, bags, or any unit cargo, buy the cargo platform. There's no middle ground that makes financial sense.",
    ],
    date: '2026-05-08',
    author: 'Dugar Auto Clinic Team',
    category: "Buyer's Guide",
    image: blazoTipper,
  },
  {
    id: 'digisense-telematics',
    slug: 'digisense-telematics',
    title: 'Mahindra DiGiSense Telematics: What It Tracks and Why It Matters',
    excerpt: 'Real-time vehicle tracking, fuel monitoring, geo-fencing, and driver behaviour scoring — built into every Mahindra commercial. Most operators leave it switched off.',
    body: [
      "Every Mahindra commercial vehicle sold today ships with DiGiSense, the company's cloud telematics platform. The hardware is already in the cabin. The activation is free for the first year. And yet most fleet operators we work with have never logged into the dashboard once.",
      "DiGiSense tracks four things continuously: location (GPS), fuel level (sender unit), engine parameters (RPM, temperature, idle time), and driver behaviour (harsh braking, sharp turns, over-speeding). Each of these maps to a real cost lever.",
      "Location data combined with geo-fencing lets you set alerts when a vehicle leaves a route or stops outside a permitted area. We've seen operators recover stolen fuel — the kind that disappears over the course of a month from drivers selling diesel mid-route — within two weeks of switching on geo-fence alerts.",
      "Driver behaviour scoring is the underrated feature. The system flags harsh acceleration and braking events per driver, per shift. Reading the data is one thing; using it to coach drivers is another. Operators who run monthly driver reviews using DiGiSense scores report 6–9% fuel improvement after three months, on top of any vehicle-level FuelSmart gains.",
      "Activation is done at the dealership. If your fleet runs Mahindra and you haven't used DiGiSense yet, bring the vehicle in — we'll set up the account, train the dispatcher, and walk you through the first month of reports.",
    ],
    date: '2026-04-19',
    author: 'Dugar Auto Clinic Team',
    category: 'Technology',
    image: earthmaster,
  },
  {
    id: 'monsoon-driving',
    slug: 'monsoon-driving-tips',
    title: 'Nepal Monsoon Driving: Pre-Season Checks for Heavy Commercial Vehicles',
    excerpt: "Brake fade, hydroplaning on cargo trucks, and undercarriage corrosion are all worse during monsoon. The 15-minute pre-shift check that prevents most monsoon breakdowns.",
    body: [
      "Monsoon in Nepal is unforgiving on heavy commercial vehicles. The combination of standing water on flat sections, mud on construction routes, and sustained humidity attacks systems that perform fine in the dry season. Most of the breakdowns we service between June and September are preventable with a 15-minute pre-shift inspection.",
      "Start with the brakes. Heavy commercials use drum brakes on rear axles; water ingress reduces friction dramatically. Before every shift in monsoon conditions, drivers should perform a stationary brake test at idle, then a low-speed brake test (10–15 km/h) before joining traffic. If the truck pulls left or right, or the pedal feels spongy, the vehicle should not leave the yard.",
      "Tyre tread and pressure matter more in monsoon than at any other time. We recommend rotating to fresh treads (above 4 mm) before the season starts, and checking pressure cold every morning — hot pressure readings during the day will mask under-inflation. Under-inflated tyres on a wet road are the single largest cause of hydroplaning incidents on highway cargo runs.",
      "Undercarriage corrosion accelerates fast in mud-and-water conditions. A weekly high-pressure wash of the chassis, leaf springs, and brake drum exteriors removes the abrasive mud-plus-grit slurry that strips paint and pits metal. Skipping this for a full monsoon shortens chassis life by 12–18 months.",
      "Finally — and this is overlooked — check the air filter weekly. Wet-season dust mixed with humidity clogs filters fast. A clogged air filter forces the engine to run rich, drops fuel mileage by 3–5%, and over time damages the turbo. Replace, don't just clean, at the first sign of restriction.",
    ],
    date: '2026-04-02',
    author: 'Dugar Auto Clinic Team',
    category: 'Service Tips',
    image: suproMini,
  },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const [activePost, setActivePost] = useState(null);
  const t = useT();

  // Reset scroll on internal navigation (list ↔ post detail). The App-level
  // scroll-to-top only fires on `currentPage` changes, not on the in-page
  // state changes that switch between list and detail views here.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePost]);

  // ── Single-post view ──
  if (activePost) {
    const post = activePost;
    return (
      <div className="pb-20 bg-white text-gray-800 min-h-screen">
        {/* Dark hero with featured image */}
        <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-black">
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/85" />
          <div className="absolute top-0 left-0 right-0 h-[88px]" />

          {/* Back-to-blog button — pinned to the top-left of the hero */}
          <button
            onClick={() => setActivePost(null)}
            className="absolute top-[108px] left-6 lg:left-10 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-bold uppercase tracking-[0.25em] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('blog.back')}
          </button>

          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 pt-[140px] pb-16">
            <div className="text-center">
              <span className="text-[rgb(213,59,59)] text-xs sm:text-sm font-bold uppercase tracking-[0.35em] mb-6 block">
                {post.category}
              </span>
              <h1 className="font-black uppercase tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl text-white max-w-5xl mx-auto">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-neutral-300 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <article className="max-w-3xl mx-auto px-6 lg:px-8 py-16 space-y-6">
          {post.body.map((para, i) => (
            <p key={i} className="text-gray-700 text-base sm:text-lg leading-[1.75]">
              {para}
            </p>
          ))}
        </article>

        {/* Back to all posts */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-12">
          <button
            onClick={() => setActivePost(null)}
            className="inline-flex items-center gap-3 bg-black hover:bg-[#e21b22] text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('blog.back')}</span>
          </button>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="pb-20 bg-white text-gray-800 min-h-screen">
      {/* Hero */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 110% 90% at 90% 20%, rgba(150,35,35,0.45) 0%, rgba(100,20,20,0.28) 25%, rgba(50,10,10,0.15) 50%, rgba(15,3,3,0.05) 75%, rgba(0,0,0,0) 95%), radial-gradient(ellipse 80% 60% at 10% 5%, rgba(100,25,25,0.22) 0%, rgba(40,8,8,0.08) 45%, rgba(0,0,0,0) 80%), #000',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[88px]" />
        <div className="relative z-10 text-center px-6 lg:px-10 pt-[140px] pb-24 max-w-6xl mx-auto w-full">
          <p className="text-[rgb(213,59,59)] text-xs sm:text-sm font-bold uppercase tracking-[0.35em] mb-8">
            {t('blog.eyebrow')}
          </p>
          <h1 className="font-black uppercase tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl">
            <span className="text-white">{t('blog.headline1')}</span><br />
            <span className="text-[rgb(213,59,59)]">{t('blog.headline2')}</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg mt-10 max-w-2xl mx-auto leading-relaxed">
            {t('blog.sub')}
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] flex flex-col"
            >
              <div className="overflow-hidden h-56">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-7 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="text-[#e21b22] font-black uppercase tracking-widest">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span>{formatDate(post.date)}</span>
                </div>
                <h3 className="text-gray-950 text-xl font-black uppercase tracking-tight leading-tight mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light mb-6 flex-grow">
                  {post.excerpt}
                </p>
                <div className="inline-flex items-center gap-3 bg-transparent border border-gray-800 group-hover:bg-[#e21b22] group-hover:border-[#e21b22] text-gray-900 group-hover:text-white font-bold uppercase tracking-wider text-sm px-8 py-4 transition-all duration-300 mt-auto self-start">
                  <span>{t('blog.readMore')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
