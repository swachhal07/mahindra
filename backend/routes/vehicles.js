import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import Vehicle from '../models/Vehicle.js';
import ImageAsset from '../models/ImageAsset.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

// Files arrive as multipart/form-data and are buffered in memory, then stored
// in MongoDB as ImageAsset documents. 12 MB per file keeps us comfortably
// under MongoDB's 16 MB document limit.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: 30 },
});

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 24 },
  { name: 'brochure', maxCount: 1 },
]);

const CATEGORIES = ['truck', 'tipper', 'light', 'construction', 'bus'];

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

async function storeFile(file, allowedTypes) {
  if (!allowedTypes.includes(file.mimetype)) {
    const err = new Error(`Unsupported file type: ${file.mimetype}`);
    err.status = 400;
    throw err;
  }
  const asset = await ImageAsset.create({
    data: file.buffer,
    contentType: file.mimetype,
    filename: file.originalname,
    size: file.size,
  });
  return asset._id;
}

// Parse a JSON field that arrives as a string inside multipart form data.
function parseJsonField(raw, fallback) {
  if (raw == null || raw === '') return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Sanitise a specs payload into [{ label, value }] with both parts non-empty.
function cleanSpecs(specs) {
  if (!Array.isArray(specs)) return [];
  return specs
    .map((s) => ({
      label: String(s?.label ?? '').trim(),
      value: String(s?.value ?? '').trim(),
    }))
    .filter((s) => s.label && s.value);
}

// Public JSON shape: ImageAsset ids become /api/images/<id> URLs the
// frontend can drop straight into <img src>.
function serialize(v) {
  return {
    id: v._id,
    name: v.name,
    category: v.category,
    tagline: v.tagline,
    price: v.price,
    specs: v.specs.map((s) => ({ label: s.label, value: s.value })),
    imageUrl: `/api/images/${v.image}`,
    imageId: v.image,
    gallery: v.gallery.map((g) => ({
      imageId: g.image,
      url: `/api/images/${g.image}`,
      label: g.label,
    })),
    brochureUrl: v.brochure ? `/api/images/${v.brochure}` : null,
    imageScale: v.imageScale,
    cardImageScale: v.cardImageScale,
    detailImageScale: v.detailImageScale,
    order: v.order,
    updatedAt: v.updatedAt,
  };
}

// Delete assets, but only those no longer referenced by any vehicle —
// seeded vehicles share gallery images and brochures, so a blind cascade
// would break siblings.
async function deleteUnreferencedAssets(assetIds) {
  for (const id of assetIds.filter(Boolean)) {
    const stillUsed = await Vehicle.exists({
      $or: [{ image: id }, { 'gallery.image': id }, { brochure: id }],
    });
    if (!stillUsed) await ImageAsset.deleteOne({ _id: id });
  }
}

function validateBasics(body) {
  const name = String(body.name ?? '').trim();
  const category = String(body.category ?? '').trim();
  if (!name) return 'Vehicle name is required.';
  if (!CATEGORIES.includes(category)) {
    return `Category must be one of: ${CATEGORIES.join(', ')}.`;
  }
  return null;
}

// ── Public reads ──

router.get('/', async (_req, res) => {
  const vehicles = await Vehicle.find().sort({ order: 1, createdAt: 1 });
  res.json({ ok: true, vehicles: vehicles.map(serialize) });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Vehicle not found.' });
  }
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ ok: false, error: 'Vehicle not found.' });
  res.json({ ok: true, vehicle: serialize(vehicle) });
});

// ── Admin writes ──

// POST /api/vehicles — create. Multipart fields:
//   name, category, tagline, price        plain text
//   specs                                 JSON [{label, value}]
//   galleryLabels                         JSON [string] (parallel to gallery files)
//   image (file, required), gallery (files), brochure (file, optional)
router.post('/', requireAuth, uploadFields, async (req, res) => {
  const invalid = validateBasics(req.body);
  if (invalid) return res.status(400).json({ ok: false, error: invalid });
  const mainFile = req.files?.image?.[0];
  if (!mainFile) return res.status(400).json({ ok: false, error: 'A main vehicle image is required.' });

  const createdAssets = [];
  try {
    const imageId = await storeFile(mainFile, IMAGE_TYPES);
    createdAssets.push(imageId);

    const galleryFiles = req.files?.gallery ?? [];
    const galleryLabels = parseJsonField(req.body.galleryLabels, []);
    const gallery = [];
    for (let i = 0; i < galleryFiles.length; i++) {
      const id = await storeFile(galleryFiles[i], IMAGE_TYPES);
      createdAssets.push(id);
      gallery.push({ image: id, label: String(galleryLabels[i] ?? '').trim() });
    }

    let brochureId = null;
    if (req.files?.brochure?.[0]) {
      brochureId = await storeFile(req.files.brochure[0], ['application/pdf']);
      createdAssets.push(brochureId);
    }

    const last = await Vehicle.findOne().sort({ order: -1 });
    const vehicle = await Vehicle.create({
      name: req.body.name.trim(),
      category: req.body.category,
      tagline: String(req.body.tagline ?? '').trim(),
      price: String(req.body.price ?? '').trim() || 'Contact for pricing',
      specs: cleanSpecs(parseJsonField(req.body.specs, [])),
      image: imageId,
      gallery,
      brochure: brochureId,
      order: last ? last.order + 1 : 0,
    });
    return res.status(201).json({ ok: true, vehicle: serialize(vehicle) });
  } catch (err) {
    // Roll back any assets stored before the failure.
    await ImageAsset.deleteMany({ _id: { $in: createdAssets } }).catch(() => {});
    const status = err.status || 500;
    console.error('[vehicles] create failed:', err.message);
    return res.status(status).json({ ok: false, error: err.status ? err.message : 'Failed to create the vehicle.' });
  }
});

// PUT /api/vehicles/:id — update. Same fields as POST, all optional, plus:
//   existingGallery   JSON [{imageId, label}] — gallery entries to KEEP
//                     (in order, labels possibly edited). New `gallery`
//                     files are appended after them.
//   removeBrochure    'true' to delete the current brochure
router.put('/:id', requireAuth, uploadFields, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Vehicle not found.' });
  }
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ ok: false, error: 'Vehicle not found.' });

  const invalid = validateBasics({ name: req.body.name ?? vehicle.name, category: req.body.category ?? vehicle.category });
  if (invalid) return res.status(400).json({ ok: false, error: invalid });

  const createdAssets = [];
  const removedAssets = [];
  try {
    if (req.body.name != null) vehicle.name = req.body.name.trim();
    if (req.body.category != null) vehicle.category = req.body.category;
    if (req.body.tagline != null) vehicle.tagline = String(req.body.tagline).trim();
    if (req.body.price != null) vehicle.price = String(req.body.price).trim() || 'Contact for pricing';
    if (req.body.specs != null) vehicle.specs = cleanSpecs(parseJsonField(req.body.specs, []));

    // Replace the main image if a new one was uploaded.
    if (req.files?.image?.[0]) {
      removedAssets.push(vehicle.image);
      vehicle.image = await storeFile(req.files.image[0], IMAGE_TYPES);
      createdAssets.push(vehicle.image);
    }

    // Rebuild the gallery: keep + relabel the entries the admin kept, drop
    // the rest, then append any newly uploaded images.
    if (req.body.existingGallery != null) {
      const keep = parseJsonField(req.body.existingGallery, []);
      const keptIds = new Set(keep.map((g) => String(g.imageId)));
      for (const g of vehicle.gallery) {
        if (!keptIds.has(String(g.image))) removedAssets.push(g.image);
      }
      vehicle.gallery = keep
        .filter((g) => mongoose.isValidObjectId(g.imageId))
        .map((g) => ({ image: g.imageId, label: String(g.label ?? '').trim() }));
    }
    const galleryFiles = req.files?.gallery ?? [];
    const galleryLabels = parseJsonField(req.body.galleryLabels, []);
    for (let i = 0; i < galleryFiles.length; i++) {
      const id = await storeFile(galleryFiles[i], IMAGE_TYPES);
      createdAssets.push(id);
      vehicle.gallery.push({ image: id, label: String(galleryLabels[i] ?? '').trim() });
    }

    if (req.body.removeBrochure === 'true' && vehicle.brochure) {
      removedAssets.push(vehicle.brochure);
      vehicle.brochure = null;
    }
    if (req.files?.brochure?.[0]) {
      if (vehicle.brochure) removedAssets.push(vehicle.brochure);
      vehicle.brochure = await storeFile(req.files.brochure[0], ['application/pdf']);
      createdAssets.push(vehicle.brochure);
    }

    await vehicle.save();
    // Only after a successful save, clean up assets that fell out of use.
    await deleteUnreferencedAssets(removedAssets);
    return res.json({ ok: true, vehicle: serialize(vehicle) });
  } catch (err) {
    await ImageAsset.deleteMany({ _id: { $in: createdAssets } }).catch(() => {});
    const status = err.status || 500;
    console.error('[vehicles] update failed:', err.message);
    return res.status(status).json({ ok: false, error: err.status ? err.message : 'Failed to update the vehicle.' });
  }
});

// DELETE /api/vehicles/:id — remove the vehicle and any of its files that
// no other vehicle still references.
router.delete('/:id', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Vehicle not found.' });
  }
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ ok: false, error: 'Vehicle not found.' });

  const assetIds = [vehicle.image, vehicle.brochure, ...vehicle.gallery.map((g) => g.image)];
  await vehicle.deleteOne();
  await deleteUnreferencedAssets(assetIds);
  return res.json({ ok: true });
});

export default router;
