import mongoose from 'mongoose';

// A vehicle shown on the public Showcase page and managed from /admin.
//
// `specs` is an ordered list of free-form label/value pairs (e.g.
// { label: 'Payload', value: 'Up to 25T GVW' }) so the admin can add any
// specification without code changes.
//
// Image fields reference ImageAsset documents; the public API serialises
// them to `/api/images/<id>` URLs (see routes/vehicles.js).
const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['truck', 'tipper', 'light', 'construction', 'bus'],
    },
    tagline: { type: String, default: '', trim: true },
    price: { type: String, default: 'Contact for pricing', trim: true },
    specs: [
      {
        _id: false,
        label: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
      },
    ],
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageAsset', required: true },
    gallery: [
      {
        _id: false,
        image: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageAsset', required: true },
        label: { type: String, default: '', trim: true },
      },
    ],
    brochure: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageAsset', default: null },

    // Optional render hints carried over from the original hardcoded data —
    // they compensate for source images with extra transparent padding.
    imageScale: { type: Number, default: null },
    cardImageScale: { type: Number, default: null },
    detailImageScale: { type: Number, default: null },

    // Manual sort order on the showcase grid (lower = earlier).
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);
