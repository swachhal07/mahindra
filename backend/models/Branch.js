import mongoose from 'mongoose';

// A dealership branch pinned on the Service Network map on the Contact page.
// Managed from /admin so branches can be added or removed without a deploy.
//
// Coordinates are stored as plain lng/lat numbers (not GeoJSON) because the
// map component takes them that way and we never run geo queries.
const branchSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    district: { type: String, default: '', trim: true },
    province: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    lng: { type: Number, required: true, min: -180, max: 180 },
    lat: { type: Number, required: true, min: -90, max: 90 },
    // Lower numbers sort first; ties fall back to city name.
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Branch', branchSchema);
