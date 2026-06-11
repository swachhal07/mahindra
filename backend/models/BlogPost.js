import mongoose from 'mongoose';

// A blog post shown on the public /blog page and managed from /admin.
// `body` is an ordered array of paragraphs — the admin form splits the
// textarea on blank lines so authors can write naturally without thinking
// about JSON structure.
//
// `image` references an ImageAsset (same pattern as vehicles).
const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    excerpt: { type: String, default: '', trim: true },
    body: [{ type: String, trim: true }],
    date: { type: Date, required: true, default: () => new Date() },
    author: { type: String, default: 'Dugar Brothers and Sons Pvt LTD Team', trim: true },
    category: { type: String, default: 'News', trim: true },
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageAsset', required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('BlogPost', blogPostSchema);
