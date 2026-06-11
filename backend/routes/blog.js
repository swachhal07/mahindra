import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import BlogPost from '../models/BlogPost.js';
import ImageAsset from '../models/ImageAsset.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: 1 },
});

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

// Turn a title into a URL-safe slug. Used when the admin leaves the slug
// field blank.
function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

async function storeImage(file) {
  if (!IMAGE_TYPES.includes(file.mimetype)) {
    const err = new Error(`Unsupported image type: ${file.mimetype}`);
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

// Split the body textarea into paragraphs. Blank lines separate paragraphs;
// single line breaks within a paragraph are preserved as-is for the reader.
function parseBody(raw) {
  if (raw == null) return [];
  return String(raw)
    .split(/\r?\n\s*\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function serialize(p) {
  return {
    id: p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    body: p.body,
    date: p.date,
    author: p.author,
    category: p.category,
    imageUrl: `/api/images/${p.image}`,
    imageId: p.image,
    order: p.order,
    updatedAt: p.updatedAt,
  };
}

async function deleteImageIfUnused(imageId) {
  if (!imageId) return;
  const stillUsed = await BlogPost.exists({ image: imageId });
  if (!stillUsed) await ImageAsset.deleteOne({ _id: imageId });
}

// Ensure the slug is unique. If `taken`, append -2, -3, etc. until free.
async function uniqueSlug(base, excludingId) {
  let slug = base;
  let i = 2;
  while (
    await BlogPost.exists(
      excludingId ? { slug, _id: { $ne: excludingId } } : { slug }
    )
  ) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

// ── Public reads ──

router.get('/', async (_req, res) => {
  const posts = await BlogPost.find().sort({ date: -1, createdAt: -1 });
  res.json({ ok: true, posts: posts.map(serialize) });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Post not found.' });
  }
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ ok: false, error: 'Post not found.' });
  res.json({ ok: true, post: serialize(post) });
});

// ── Admin writes ──

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const title = String(req.body.title ?? '').trim();
  if (!title) return res.status(400).json({ ok: false, error: 'Title is required.' });
  if (!req.file) return res.status(400).json({ ok: false, error: 'A featured image is required.' });

  let imageId = null;
  try {
    imageId = await storeImage(req.file);
    const baseSlug = slugify(req.body.slug?.trim() || title);
    const slug = await uniqueSlug(baseSlug);

    const dateStr = String(req.body.date ?? '').trim();
    const date = dateStr ? new Date(dateStr) : new Date();
    if (Number.isNaN(date.getTime())) {
      throw Object.assign(new Error('Invalid date.'), { status: 400 });
    }

    const post = await BlogPost.create({
      title,
      slug,
      excerpt: String(req.body.excerpt ?? '').trim(),
      body: parseBody(req.body.body),
      date,
      author: String(req.body.author ?? '').trim() || 'Dugar Brothers and Sons Pvt LTD Team',
      category: String(req.body.category ?? '').trim() || 'News',
      image: imageId,
    });
    return res.status(201).json({ ok: true, post: serialize(post) });
  } catch (err) {
    if (imageId) await ImageAsset.deleteOne({ _id: imageId }).catch(() => {});
    const status = err.status || 500;
    console.error('[blog] create failed:', err.message);
    return res.status(status).json({ ok: false, error: err.status ? err.message : 'Failed to create the post.' });
  }
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Post not found.' });
  }
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ ok: false, error: 'Post not found.' });

  let newImageId = null;
  let removedImageId = null;
  try {
    if (req.body.title != null) post.title = String(req.body.title).trim();
    if (req.body.slug != null) {
      const requested = slugify(req.body.slug.trim() || post.title);
      post.slug = await uniqueSlug(requested, post._id);
    }
    if (req.body.excerpt != null) post.excerpt = String(req.body.excerpt).trim();
    if (req.body.body != null) post.body = parseBody(req.body.body);
    if (req.body.author != null) post.author = String(req.body.author).trim() || 'Dugar Brothers and Sons Pvt LTD Team';
    if (req.body.category != null) post.category = String(req.body.category).trim() || 'News';
    if (req.body.date != null && req.body.date !== '') {
      const d = new Date(req.body.date);
      if (Number.isNaN(d.getTime())) {
        throw Object.assign(new Error('Invalid date.'), { status: 400 });
      }
      post.date = d;
    }

    if (req.file) {
      removedImageId = post.image;
      newImageId = await storeImage(req.file);
      post.image = newImageId;
    }

    await post.save();
    if (removedImageId) await deleteImageIfUnused(removedImageId);
    return res.json({ ok: true, post: serialize(post) });
  } catch (err) {
    if (newImageId) await ImageAsset.deleteOne({ _id: newImageId }).catch(() => {});
    const status = err.status || 500;
    console.error('[blog] update failed:', err.message);
    return res.status(status).json({ ok: false, error: err.status ? err.message : 'Failed to update the post.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Post not found.' });
  }
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ ok: false, error: 'Post not found.' });

  const imageId = post.image;
  await post.deleteOne();
  await deleteImageIfUnused(imageId);
  return res.json({ ok: true });
});

export default router;
