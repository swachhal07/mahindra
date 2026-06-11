// One-off helper: updates ONLY the `price` field on existing vehicles,
// matched by name. Leaves specs, photos, gallery and brochure untouched —
// so any custom edits you made in /admin survive.
//
// Run from /backend:
//   npm run update-prices
//
// Add or change a row in the PRICES map below to retag a vehicle, then
// re-run.
import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';
import Vehicle from './models/Vehicle.js';

dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const PRICES = {
  'LoadKing Optimo Truck 2.5': 'NPR 3,460,000',
  'LoadKing Optimo Tipper 2.5': 'NPR 3,445,000',
  'Supro Mini Profit Truck VX': 'NPR 2,215,000',
  'Supro Maxi Profit Truck VX/LX': 'NPR 2,352,000',
  'Mahindra EarthMaster SX90': 'Contact for pricing',
  'Blazo X Tipper m Dura 28': 'NPR 11,750,000',
  'Blazo X 35 Truck': 'NPR 8,900,000',
  'Cruzio Grande Bus': 'NPR 6,200,000',
  'Cruzio School Bus': 'NPR 4,699,000',
};

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in backend/.env — aborting.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.\n');

  let updated = 0;
  let unchanged = 0;
  let missing = 0;

  for (const [name, price] of Object.entries(PRICES)) {
    const vehicle = await Vehicle.findOne({ name });
    if (!vehicle) {
      console.log(`  ⚠️  ${name}: not found in the database, skipping`);
      missing++;
      continue;
    }
    if (vehicle.price === price) {
      console.log(`  ·  ${name}: already "${price}"`);
      unchanged++;
      continue;
    }
    const oldPrice = vehicle.price;
    vehicle.price = price;
    await vehicle.save();
    console.log(`  ✓  ${name}: "${oldPrice}" → "${price}"`);
    updated++;
  }

  console.log(
    `\nDone — ${updated} updated, ${unchanged} already current, ${missing} not found.`
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Price update failed:', err);
  process.exit(1);
});
