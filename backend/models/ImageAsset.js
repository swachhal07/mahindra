import mongoose from 'mongoose';

// Binary file storage (vehicle photos, gallery shots, brochure PDFs) kept
// directly in MongoDB so the backend needs no persistent disk and no
// third-party file host — it works the same on a laptop, Render, or a VPS.
//
// Files are served by GET /api/images/:id with long-lived cache headers
// (assets are immutable: editing a vehicle uploads a new asset and the old
// one is deleted). MongoDB's 16 MB document limit caps individual files;
// uploads are limited to 12 MB in the route layer to stay safely below it.
const imageAssetSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, default: '' },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('ImageAsset', imageAssetSchema);
