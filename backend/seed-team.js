// One-off import of the people hardcoded on the Leadership page — the board
// of directors and the management team — so their photos, roles, and text can
// be managed from /admin.
//
// Run from this folder with:  npm run seed:team
// Safe to re-run: members that already exist (matched on name) are skipped.

import 'dotenv/config';
import dns from 'node:dns';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import TeamMember from './models/TeamMember.js';
import ImageAsset from './models/ImageAsset.js';

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
};

const MEMBERS = [
  {
    group: 'board',
    name: 'Moti Lal Dugar',
    role: 'Chairman',
    generation: 'First Generation',
    responsibility: 'Strategy, partnerships, and long-term vision.',
    focal: 'center 18%',
    file: 'af0b8ecf-4ddc-41f9-9dd1-ba5c0df1b212.webp',
  },
  {
    group: 'board',
    name: 'Vivek Dugar',
    role: 'Vice Chairman',
    generation: 'Second Generation',
    responsibility: 'Operations, dealer network, Mahindra liaison.',
    focal: 'center 25%',
    file: 'ae68fbad-4028-45aa-81d5-44d526f4f5af.webp',
  },
  {
    group: 'board',
    name: 'Shubham Dugar',
    role: 'Director',
    generation: 'Third Generation',
    responsibility: 'Fleet sales, commercial vehicles, government accounts.',
    focal: 'center 30%',
    file: 'af5ea000-e8c5-4f03-ac64-9fd3a8bb8009.webp',
  },
  {
    group: 'board',
    name: 'Naman Dugar',
    role: 'Director',
    generation: 'Third Generation',
    responsibility: 'Service network, spare parts, technician training.',
    focal: 'center 25%',
    file: 'eb7eb529-8d15-4359-8ac0-df51b7393d00.webp',
  },

  { group: 'management', name: 'Sudeep Raj Subedi', role: 'Business Head', file: 'mgmt-sudip-subedi.webp' },
  { group: 'management', name: 'Sudeep Singh', role: 'Sales Head', file: 'mgmt-sudeep-singh.webp' },
  { group: 'management', name: 'Abhisheek Mishary', role: 'Spare Parts Head', file: 'mgmt-mishra.jpeg' },
  { group: 'management', name: 'Laxmi Prasad Yadav', role: 'Service Head', file: 'mgmt-laxmi-yadav.jpeg' },
  { group: 'management', name: 'Shatrudhan Thakur', role: 'Service Head-CE', file: 'mgmt-thakur.jpeg' },
];

async function uploadPhoto(filename) {
  const data = await readFile(path.join(ASSETS, filename));
  const contentType = MIME[path.extname(filename).toLowerCase()];
  if (!contentType) throw new Error(`Unknown file type: ${filename}`);
  const doc = await ImageAsset.create({ data, contentType, filename, size: data.length });
  console.log(`  uploaded ${filename} (${(data.length / 1024).toFixed(0)} KB)`);
  return doc._id;
}

async function run() {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in backend/.env. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('[seed:team] MongoDB connected.');

  let created = 0;
  let skipped = 0;
  for (const [i, m] of MEMBERS.entries()) {
    const existing = await TeamMember.findOne({ name: m.name });
    if (existing) {
      // Backfill fields added after an earlier seed run (group, board text).
      const patch = {};
      if (!existing.group) patch.group = m.group;
      if (m.generation && !existing.generation) patch.generation = m.generation;
      if (m.responsibility && !existing.responsibility) patch.responsibility = m.responsibility;
      if (Object.keys(patch).length) {
        Object.assign(existing, patch);
        await existing.save();
        console.log(`  updated ${m.name} (${Object.keys(patch).join(', ')})`);
      } else {
        console.log(`  skip    ${m.name} (already exists)`);
      }
      skipped += 1;
      continue;
    }
    const photo = await uploadPhoto(m.file);
    await TeamMember.create({
      group: m.group,
      name: m.name,
      role: m.role,
      generation: m.generation ?? '',
      responsibility: m.responsibility ?? '',
      focal: m.focal ?? 'center 25%',
      photo,
      order: i,
    });
    created += 1;
    console.log(`  created ${m.name}`);
  }

  console.log(`\nDone. ${created} created, ${skipped} already present.`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('[seed:team] failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
