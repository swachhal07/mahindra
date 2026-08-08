// One-off import of the 12 dealership branches that were previously
// hardcoded in the frontend, so they can be managed from /admin instead.
//
// Run from this folder with:  npm run seed:branches
// Safe to re-run: existing branches (matched on city) are left untouched.

import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';
import Branch from './models/Branch.js';

dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const BRANCHES = [
  { city: 'Kathmandu', district: 'Kathmandu', province: 'Bagmati', phone: '01-4380639', lng: 85.3240, lat: 27.7172 },
  { city: 'Jeetpur', district: 'Bara', province: 'Madesh', phone: '9802538774', lng: 84.9761, lat: 27.2213 },
  { city: 'Hetauda', district: 'Makwanpur', province: 'Bagmati', phone: '9802750827', lng: 85.0322, lat: 27.4287 },
  { city: 'Chapur', district: 'Rauthat', province: 'Madesh', phone: '9802057825', lng: 85.2833, lat: 27.0000 },
  { city: 'Nepalgunj', district: 'Banke', province: 'Lumbini', phone: '9802548272', lng: 81.6167, lat: 28.0500 },
  { city: 'Janakpur', district: 'Dhanusha', province: 'Madesh', phone: '9802059372', lng: 85.9247, lat: 26.7288 },
  { city: 'Dhangadi', district: 'Kailali', province: 'Sudur Paschim', phone: '9801913010', lng: 80.5898, lat: 28.6957 },
  { city: 'Butwal', district: 'Butwal', province: 'Lumbini', phone: '9802079248', lng: 83.4483, lat: 27.7006 },
  { city: 'Lahan', district: 'Siraha', province: 'Madesh', phone: '9802057825', lng: 86.4900, lat: 26.7226 },
  { city: 'Birtamode', district: 'Birtamode', province: 'Koshi', phone: '9802798555', lng: 87.9915, lat: 26.6446 },
  { city: 'Dang', district: 'Dang', province: 'Lumbini', phone: '9802059386', lng: 82.4833, lat: 28.0333 },
  { city: 'Biratnagar', district: 'Biratnagar', province: 'Koshi', phone: '9802701803', lng: 87.2718, lat: 26.4525 },
];

async function run() {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in backend/.env. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('[seed:branches] MongoDB connected.');

  let created = 0;
  let skipped = 0;
  for (const [i, branch] of BRANCHES.entries()) {
    const exists = await Branch.exists({ city: branch.city });
    if (exists) {
      skipped += 1;
      console.log(`  skip    ${branch.city} (already exists)`);
      continue;
    }
    await Branch.create({ ...branch, order: i });
    created += 1;
    console.log(`  created ${branch.city}`);
  }

  console.log(`\nDone. ${created} created, ${skipped} already present.`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('[seed:branches] failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
