import mongoose from 'mongoose';

// A person shown on the public Leadership page — either the board of
// directors or the management team, selected by `group`. Managed from /admin
// so photos and roles can change without a deploy.
//
// `photo` references an ImageAsset (same pattern as vehicles and blog posts).
// `focal` is a CSS object-position value ("center 25%") used to keep faces in
// frame inside the fixed 3:4 portrait tiles.
const teamMemberSchema = new mongoose.Schema(
  {
    // Which section of the Leadership page this person appears in.
    group: {
      type: String,
      enum: ['board', 'management'],
      default: 'management',
      index: true,
    },
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '', trim: true },
    // Board cards only: the extra two lines under the portrait.
    generation: { type: String, default: '', trim: true },
    responsibility: { type: String, default: '', trim: true },
    photo: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageAsset', default: null },
    focal: { type: String, default: 'center 25%', trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('TeamMember', teamMemberSchema);
