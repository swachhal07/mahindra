// One-time seeder: imports the 9 vehicles that were hardcoded in the
// frontend (frontend/src/pages/Showcase.jsx) into MongoDB — including their
// photos, feature galleries and brochure PDFs — so the admin portal can
// edit or delete every vehicle on the site, not just newly added ones.
//
// Run from /backend with the same .env the server uses:
//   npm run seed
//
// Safe to re-run: it refuses to seed if any vehicles already exist
// (pass --force to wipe the vehicle catalog and re-seed from scratch).
import 'dotenv/config';
import dns from 'node:dns';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import Vehicle from './models/Vehicle.js';
import BlogPost from './models/BlogPost.js';
import ImageAsset from './models/ImageAsset.js';

// Some home ISPs don't return SRV records — force Google + Cloudflare DNS for
// this Node process so `mongodb+srv://` URIs resolve reliably (same fix as
// index.js).
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const ASSETS = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../frontend/src/assets'
);

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
};

// Upload each unique file once even when vehicles share it (the two LoadKing
// models share a gallery, the two Blazo models share a gallery + brochure).
const assetCache = new Map();
async function asset(filename) {
  if (assetCache.has(filename)) return assetCache.get(filename);
  const data = await readFile(path.join(ASSETS, filename));
  const contentType = MIME[path.extname(filename).toLowerCase()];
  if (!contentType) throw new Error(`Unknown file type: ${filename}`);
  const doc = await ImageAsset.create({ data, contentType, filename, size: data.length });
  assetCache.set(filename, doc._id);
  console.log(`  uploaded ${filename} (${(data.length / 1024).toFixed(0)} KB)`);
  return doc._id;
}

async function gallery(entries) {
  const out = [];
  for (const [filename, label] of entries) out.push({ image: await asset(filename), label });
  return out;
}

// ── Gallery definitions (filename, label) — mirrors Showcase.jsx ──

const loadkingTipperGallery = [
  ['gallery-5 (2).jpg', 'mDi Diesel Engine'],
  ['gallery-6 (2).jpg', 'Driver Cabin Seating'],
  ['gallery-4 (2).jpg', 'Rear Chassis & Suspension'],
  ['gallery-7 (1).jpg', 'Heavy-Duty Rear Axle'],
  ['gallery-2.jpg', 'Anti-Roll Stabilizer Bar'],
  ['gallery-1.jpg', 'Driver Cockpit'],
  ['gallery-3 (1).jpg', 'Heavy-Duty Clutch Plate'],
  ['gallery-10 (2).jpg', 'Compact Tipper Profile'],
];

const suproMiniGallery = [
  ['gallery_photo_big2.jpg', 'Compact City Profile'],
  ['gallery_photo_big3.jpg', 'Spacious Cargo Bed'],
  ['gallery_photo_big4.jpg', 'Driver-First Cabin'],
];

const suproMaxiGallery = [
  ['gallery_image_05.jpg', 'Bold Front Stance'],
  ['gallery_image_06.jpg', 'High-Capacity Cargo Deck'],
  ['gallery_image_07.jpg', 'Comfort-First Interior'],
  ['gallery_image_08.jpg', 'mDi Tech Powertrain'],
];

const earthmasterGallery = [
  ['Screenshot 2026-06-07 113049.png', 'Engine'],
  ['Screenshot 2026-06-07 113103.png', 'Cabin'],
  ['Screenshot 2026-06-07 113112.png', 'Carraro Axle'],
  ['Screenshot 2026-06-07 113143.png', 'Operator-First Cabin'],
  ['Screenshot 2026-06-07 113204.png', 'Precision Hydraulics'],
];

const blazoX35Gallery = [
  ['engine.jpg', 'BlazoX FuelSmart Engine'],
  ['tilt.jpg', 'Tilt Cabin'],
  ['sleeper.jpg', 'Sleeper Cabin'],
  ['3way.jpg', '3-Way Adjustable Driver Seat'],
  ['dis.jpg', 'Digital Instrument Cluster'],
  ['diseltank.jpg', 'High-Capacity Diesel Tank'],
  ['chasisframe.jpg', 'Reinforced Chassis Frame'],
  ['clutchsystem.jpg', 'Heavy-Duty Clutch System'],
  ['brakingsystem.jpg', 'Air-Assist Braking System'],
  ['headlamps.jpg', 'Performance Headlamps'],
  ['gallery-8.jpg', 'Apollo Endurance Tyres'],
  ['gallery-9.jpg', 'Heavy Duty Rear Axle'],
];

const cruzioGrandeGallery = [
  ['gallery-23.jpg', 'Digital Instrument Cluster'],
  ['gallery-21.jpg', 'USB Charging Port'],
  ['gallery-17.jpg', 'Engineered Bus Chassis'],
  ['gallery-13.jpg', 'Driver Cockpit'],
  ['gallery-11.jpg', 'Heavy-Duty Leaf Suspension'],
  ['gallery-6.jpg', 'FuelSmart Drive Modes'],
  ['gallery-5.jpg', 'mPower Engine'],
  ['gallery-4.jpg', 'Comfort Passenger Seating'],
];

const cruzioSchoolGallery = [
  ['gallery-4 (1).jpg', 'Student Seating Aisle'],
  ['gallery-5 (1).jpg', 'Emergency Exit Door'],
  ['gallery-6 (1).jpg', 'Fire Extinguisher'],
  ['gallery-7.jpg', 'Spacious Interior'],
  ['gallery-9 (1).jpg', 'Heavy-Duty Clutch'],
  ['gallery-10 (1).jpg', 'mPower Engine'],
  ['gallery-11 (1).jpg', 'FuelSmart Drive Modes'],
  ['gallery-13 (1).jpg', 'Stop Request Button'],
  ['gallery-14 (1).jpg', 'First Aid Kit'],
];

// ── Vehicle definitions — mirrors the hardcoded array in Showcase.jsx ──

// Prices from the official Mahindra & Mahindra Nepal price list (BS-VI).
// Update in the admin if MRP changes — this seed is only the starting point.
const VEHICLES = [
  {
    name: 'LoadKing Optimo Truck 2.5',
    category: 'truck',
    tagline: 'Optimised load. Optimised profits.',
    price: 'NPR 3,460,000',
    image: 'loadking optimo truck.png',
    imageScale: 1.2,
    specs: [
      ['Category', 'Medium Duty Cargo'],
      ['Payload', 'Up to 25T GVW'],
      ['Engine', 'mDi Tech CRDe'],
      ['Use Case', 'Cargo / Logistics'],
    ],
    gallery: loadkingTipperGallery,
    brochure: 'optimo.pdf',
  },
  {
    name: 'LoadKing Optimo Tipper 2.5',
    category: 'tipper',
    tagline: 'Built for the toughest sites.',
    price: 'NPR 3,445,000',
    image: 'Loadking optimo tipper.png',
    specs: [
      ['Category', 'Medium Duty Tipper'],
      ['Payload', 'Up to 25T GVW'],
      ['Engine', 'mDi Tech CRDe'],
      ['Use Case', 'Construction / Quarry'],
    ],
    gallery: loadkingTipperGallery,
    brochure: 'optimo.pdf',
  },
  {
    name: 'Supro Mini Profit Truck VX',
    category: 'light',
    tagline: 'Compact. Capable. Always on time.',
    price: 'NPR 2,215,000',
    image: 'supro-mini-truck-front-view.png',
    cardImageScale: 1.4,
    detailImageScale: 1.0,
    specs: [
      ['Category', 'Light Commercial'],
      ['Payload', '750 kg'],
      ['Engine', '909cc DI Diesel'],
      ['Use Case', 'Last-Mile Delivery'],
    ],
    gallery: suproMiniGallery,
    brochure: 'supro-profitminitruck-mini.pdf',
  },
  {
    name: 'Supro Maxi Profit Truck VX/LX',
    category: 'light',
    tagline: 'More payload, more profit.',
    price: 'NPR 2,352,000',
    image: 'Supro Maxi VX .png',
    specs: [
      ['Category', 'Light Commercial'],
      ['Payload', '900 kg'],
      ['Engine', 'mDi Tech Diesel'],
      ['Use Case', 'City Logistics'],
    ],
    gallery: suproMaxiGallery,
    brochure: 'supro-profitminitruck-maxi.pdf',
  },
  {
    name: 'Mahindra EarthMaster SX90',
    category: 'construction',
    tagline: 'Power meets precision. 4WD backhoe loader.',
    price: 'Contact for pricing',
    image: 'mahindra-earthmaster-sx-1686128588.jpg',
    detailImageScale: 1.0,
    specs: [
      ['Category', 'Backhoe Loader'],
      ['Power', '90 HP CRDi'],
      ['Drive', '4WD'],
      ['Use Case', 'Heavy Construction'],
    ],
    gallery: earthmasterGallery,
    brochure: 'Infrajunction-prod__brochures_pdf4_e35f620584.pdf',
  },
  {
    name: 'Blazo X Tipper m Dura 28',
    category: 'tipper',
    tagline: 'Heavy haulage with FuelSmart efficiency.',
    price: 'NPR 11,750,000',
    image: 'blazoX35TipperM Dura.png',
    specs: [
      ['Category', 'Heavy Duty Tipper'],
      ['Payload', 'Up to 35T'],
      ['Engine', 'mPower FuelSmart'],
      ['Use Case', 'Mining / Earthmoving'],
    ],
    gallery: blazoX35Gallery,
    brochure: 'blazo-brochure.pdf',
  },
  {
    name: 'Blazo X 35 Truck',
    category: 'truck',
    tagline: 'Long-haul cargo. Class-leading mileage.',
    price: 'Contact for pricing',
    image: 'BlazoX35.png',
    specs: [
      ['Category', 'Heavy Duty Cargo'],
      ['Payload', 'Up to 35T GVW'],
      ['Engine', 'mPower FuelSmart'],
      ['Use Case', 'Long-Haul Logistics'],
    ],
    gallery: blazoX35Gallery,
    brochure: 'blazo-brochure.pdf',
  },
  {
    name: 'Cruzio Grande Bus',
    category: 'bus',
    tagline: 'Long-distance comfort. Modern passenger transport.',
    price: 'NPR 6,200,000',
    image: '7.png',
    cardImageScale: 1.5,
    specs: [
      ['Category', 'Passenger Bus'],
      ['Payload', '40+ Seater'],
      ['Engine', 'mPower Diesel'],
      ['Use Case', 'Inter-City Travel'],
    ],
    gallery: cruzioGrandeGallery,
    brochure: 'cruzio-grande.pdf',
  },
  {
    name: 'Cruzio School Bus',
    category: 'bus',
    tagline: 'Safe, reliable transport for students every day.',
    price: 'NPR 4,699,000',
    image: '6.png',
    cardImageScale: 1.5,
    specs: [
      ['Category', 'School Bus'],
      ['Payload', 'Up to 32 Seater'],
      ['Engine', 'mPower Diesel'],
      ['Use Case', 'Student Transport'],
    ],
    gallery: cruzioSchoolGallery,
    brochure: 'cruzio-grande.pdf',
  },
];

// ── Blog post definitions — mirrors the hardcoded array in Blog.jsx ──

const POSTS = [
  {
    title: 'FuelSmart Technology Explained: How Blazo X Saves Diesel',
    slug: 'fuelsmart-explained',
    excerpt:
      "Mahindra's FuelSmart switching modes (Turbo, Heavy, Light) let drivers match engine output to real-time load. Here's how it actually moves the mileage needle.",
    body: [
      "Fuel is the single largest line item in any heavy commercial operation in Nepal. Even a 5% improvement in mileage compounds into significant savings over a vehicle's life. Mahindra's FuelSmart engine technology, fitted across the Blazo X range, tackles this directly.",
      'FuelSmart engines support three switchable driving modes. Turbo mode delivers maximum power for steep climbs and full loads. Heavy mode balances power and efficiency for typical highway haulage. Light mode tunes the engine for empty return runs and city operations, where pulling Turbo power would waste diesel.',
      'Drivers select the mode via a switch on the dashboard. The ECU then re-maps fuel injection timing and turbo boost pressure for the selected profile. In field testing on the Birgunj–Kathmandu route, switching to Light on empty returns yielded 8–12% better mileage versus running Heavy throughout.',
      "The system is mechanical-electronic, not software-only. There's nothing to install or update. Fleet operators who train drivers to switch modes by trip phase typically see the biggest fuel savings in months one through three, then stable lower-burn operations from there.",
    ],
    date: '2026-05-22',
    author: 'Dugar Auto Clinic Team',
    category: 'Technology',
    image: 'mahindra-blazo-x-35-cargo.avif',
  },
  {
    title: 'Tipper or Cargo Truck? Choosing the Right Mahindra for Your Site',
    slug: 'choosing-tipper-vs-cargo',
    excerpt:
      "Construction operators often pick by chassis size alone — but tipper geometry, dump-bed angle, and axle layout matter more for your specific work. A buyer's framework.",
    body: [
      "The first question we ask every construction buyer who walks into the showroom is simple: what does the vehicle actually do, hour by hour, during a typical shift? The answer almost always reveals whether a tipper or a cargo platform is the right call — regardless of which feels more 'rugged' on paper.",
      'Tippers are purpose-built for one motion: lift the bed, dump the load, drop the bed. The hydraulics, frame reinforcement, and bed geometry are all optimized for this. The Mahindra Blazo X m-DURA Tipper and LoadKing Optimo Tipper 25 are both designed around quarry, mine, and aggregate-dumping cycles where the truck unloads multiple times per shift.',
      'Cargo trucks (Blazo X 35 Truck, LoadKing Optimo Truck 25) carry payload over distance with manual or forklift unloading at the destination. The bed is fixed, the frame is tuned for sustained highway speeds, and the gearing favours fuel economy at cruise.',
      "The mismatch we see most often: an operator buys a tipper for general transport because it 'looks tougher,' then never uses the dump mechanism. They pay for hydraulics they don't need, carry less payload than a cargo truck of the same chassis class would, and burn more diesel hauling unused equipment weight. The reverse mistake — buying a cargo truck for a dumping operation — wears out the bed and frame within 18 months.",
      "Our rule of thumb: if the truck dumps its load more than once a week, buy a tipper. If it's pallets, bags, or any unit cargo, buy the cargo platform. There's no middle ground that makes financial sense.",
    ],
    date: '2026-05-08',
    author: 'Dugar Auto Clinic Team',
    category: "Buyer's Guide",
    image: 'blazo_tipper_upscaled.png',
  },
  {
    title: 'Mahindra DiGiSense Telematics: What It Tracks and Why It Matters',
    slug: 'digisense-telematics',
    excerpt:
      'Real-time vehicle tracking, fuel monitoring, geo-fencing, and driver behaviour scoring — built into every Mahindra commercial. Most operators leave it switched off.',
    body: [
      "Every Mahindra commercial vehicle sold today ships with DiGiSense, the company's cloud telematics platform. The hardware is already in the cabin. The activation is free for the first year. And yet most fleet operators we work with have never logged into the dashboard once.",
      'DiGiSense tracks four things continuously: location (GPS), fuel level (sender unit), engine parameters (RPM, temperature, idle time), and driver behaviour (harsh braking, sharp turns, over-speeding). Each of these maps to a real cost lever.',
      "Location data combined with geo-fencing lets you set alerts when a vehicle leaves a route or stops outside a permitted area. We've seen operators recover stolen fuel — the kind that disappears over the course of a month from drivers selling diesel mid-route — within two weeks of switching on geo-fence alerts.",
      'Driver behaviour scoring is the underrated feature. The system flags harsh acceleration and braking events per driver, per shift. Reading the data is one thing; using it to coach drivers is another. Operators who run monthly driver reviews using DiGiSense scores report 6–9% fuel improvement after three months, on top of any vehicle-level FuelSmart gains.',
      "Activation is done at the dealership. If your fleet runs Mahindra and you haven't used DiGiSense yet, bring the vehicle in — we'll set up the account, train the dispatcher, and walk you through the first month of reports.",
    ],
    date: '2026-04-19',
    author: 'Dugar Auto Clinic Team',
    category: 'Technology',
    image: 'mahindra-earthmaster-sx-iv-1911306843.jpg',
  },
  {
    title: 'Nepal Monsoon Driving: Pre-Season Checks for Heavy Commercial Vehicles',
    slug: 'monsoon-driving-tips',
    excerpt:
      'Brake fade, hydroplaning on cargo trucks, and undercarriage corrosion are all worse during monsoon. The 15-minute pre-shift check that prevents most monsoon breakdowns.',
    body: [
      'Monsoon in Nepal is unforgiving on heavy commercial vehicles. The combination of standing water on flat sections, mud on construction routes, and sustained humidity attacks systems that perform fine in the dry season. Most of the breakdowns we service between June and September are preventable with a 15-minute pre-shift inspection.',
      'Start with the brakes. Heavy commercials use drum brakes on rear axles; water ingress reduces friction dramatically. Before every shift in monsoon conditions, drivers should perform a stationary brake test at idle, then a low-speed brake test (10–15 km/h) before joining traffic. If the truck pulls left or right, or the pedal feels spongy, the vehicle should not leave the yard.',
      'Tyre tread and pressure matter more in monsoon than at any other time. We recommend rotating to fresh treads (above 4 mm) before the season starts, and checking pressure cold every morning — hot pressure readings during the day will mask under-inflation. Under-inflated tyres on a wet road are the single largest cause of hydroplaning incidents on highway cargo runs.',
      'Undercarriage corrosion accelerates fast in mud-and-water conditions. A weekly high-pressure wash of the chassis, leaf springs, and brake drum exteriors removes the abrasive mud-plus-grit slurry that strips paint and pits metal. Skipping this for a full monsoon shortens chassis life by 12–18 months.',
      "Finally — and this is overlooked — check the air filter weekly. Wet-season dust mixed with humidity clogs filters fast. A clogged air filter forces the engine to run rich, drops fuel mileage by 3–5%, and over time damages the turbo. Replace, don't just clean, at the first sign of restriction.",
    ],
    date: '2026-04-02',
    author: 'Dugar Auto Clinic Team',
    category: 'Service Tips',
    image: 'supro-mini-truck-front-view.png',
  },
];

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in backend/.env — aborting.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const existingVehicles = await Vehicle.countDocuments();
  const existingPosts = await BlogPost.countDocuments();
  if (existingVehicles > 0 || existingPosts > 0) {
    if (!process.argv.includes('--force')) {
      console.log(
        `Already seeded: ${existingVehicles} vehicle(s), ${existingPosts} post(s) — nothing to do.\n` +
          'Run "npm run seed -- --force" to wipe and re-seed.'
      );
      await mongoose.disconnect();
      return;
    }
    console.log(`--force: deleting existing catalog and all stored files…`);
    await Vehicle.deleteMany({});
    await BlogPost.deleteMany({});
    await ImageAsset.deleteMany({});
  }

  console.log('\n— Vehicles —');
  for (let i = 0; i < VEHICLES.length; i++) {
    const v = VEHICLES[i];
    console.log(`Seeding ${v.name}…`);
    await Vehicle.create({
      name: v.name,
      category: v.category,
      tagline: v.tagline,
      price: v.price ?? 'Contact for pricing',
      specs: v.specs.map(([label, value]) => ({ label, value })),
      image: await asset(v.image),
      gallery: await gallery(v.gallery),
      brochure: v.brochure ? await asset(v.brochure) : null,
      imageScale: v.imageScale ?? null,
      cardImageScale: v.cardImageScale ?? null,
      detailImageScale: v.detailImageScale ?? null,
      order: i,
    });
  }

  console.log('\n— Blog posts —');
  for (const p of POSTS) {
    console.log(`Seeding ${p.title}…`);
    await BlogPost.create({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      body: p.body,
      date: new Date(p.date),
      author: p.author,
      category: p.category,
      image: await asset(p.image),
    });
  }

  console.log(`\nDone — seeded ${VEHICLES.length} vehicles and ${POSTS.length} blog posts.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
