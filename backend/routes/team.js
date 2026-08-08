import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import TeamMember from '../models/TeamMember.js';
import ImageAsset from '../models/ImageAsset.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: 1 },
});

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

async function storePhoto(file) {
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

// Drop an orphaned photo once no member references it.
async function deletePhotoIfUnused(photoId) {
  if (!photoId) return;
  const stillUsed = await TeamMember.exists({ photo: photoId });
  if (!stillUsed) await ImageAsset.deleteOne({ _id: photoId });
}

const GROUPS = ['board', 'management'];

function serialize(m) {
  return {
    id: m._id,
    group: m.group,
    name: m.name,
    role: m.role,
    generation: m.generation,
    responsibility: m.responsibility,
    focal: m.focal,
    order: m.order,
    photoUrl: m.photo ? `/api/images/${m.photo}` : null,
    photoId: m.photo,
    updatedAt: m.updatedAt,
  };
}

// ── Public read ──

// `?group=board` / `?group=management` narrows the list; without it every
// person is returned so the admin can show both sections in one request.
router.get('/', async (req, res) => {
  const group = String(req.query.group ?? '').trim();
  const filter = GROUPS.includes(group) ? { group } : {};
  const members = await TeamMember.find(filter).sort({ order: 1, createdAt: 1 });
  res.json({ ok: true, members: members.map(serialize) });
});

// ── Admin writes ──

router.post('/', requireAuth, upload.single('photo'), async (req, res) => {
  const name = String(req.body.name ?? '').trim();
  if (!name) return res.status(400).json({ ok: false, error: 'Name is required.' });

  let photoId = null;
  try {
    if (req.file) photoId = await storePhoto(req.file);
    const group = String(req.body.group ?? '').trim();
    const member = await TeamMember.create({
      group: GROUPS.includes(group) ? group : 'management',
      name,
      role: String(req.body.role ?? '').trim(),
      generation: String(req.body.generation ?? '').trim(),
      responsibility: String(req.body.responsibility ?? '').trim(),
      focal: String(req.body.focal ?? '').trim() || 'center 25%',
      order: Number(req.body.order) || 0,
      photo: photoId,
    });
    return res.status(201).json({ ok: true, member: serialize(member) });
  } catch (err) {
    if (photoId) await ImageAsset.deleteOne({ _id: photoId }).catch(() => {});
    const status = err.status || 500;
    console.error('[team] create failed:', err.message);
    return res
      .status(status)
      .json({ ok: false, error: err.status ? err.message : 'Failed to add the team member.' });
  }
});

router.put('/:id', requireAuth, upload.single('photo'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Team member not found.' });
  }
  const member = await TeamMember.findById(req.params.id);
  if (!member) return res.status(404).json({ ok: false, error: 'Team member not found.' });

  let newPhotoId = null;
  let removedPhotoId = null;
  try {
    if (req.body.name != null) {
      const name = String(req.body.name).trim();
      if (!name) throw Object.assign(new Error('Name is required.'), { status: 400 });
      member.name = name;
    }
    if (req.body.role != null) member.role = String(req.body.role).trim();
    if (req.body.group != null) {
      const group = String(req.body.group).trim();
      if (GROUPS.includes(group)) member.group = group;
    }
    if (req.body.generation != null) member.generation = String(req.body.generation).trim();
    if (req.body.responsibility != null) {
      member.responsibility = String(req.body.responsibility).trim();
    }
    if (req.body.focal != null) member.focal = String(req.body.focal).trim() || 'center 25%';
    if (req.body.order != null) member.order = Number(req.body.order) || 0;

    if (req.file) {
      removedPhotoId = member.photo;
      newPhotoId = await storePhoto(req.file);
      member.photo = newPhotoId;
    }

    await member.save();
    if (removedPhotoId) await deletePhotoIfUnused(removedPhotoId);
    return res.json({ ok: true, member: serialize(member) });
  } catch (err) {
    if (newPhotoId) await ImageAsset.deleteOne({ _id: newPhotoId }).catch(() => {});
    const status = err.status || 500;
    console.error('[team] update failed:', err.message);
    return res
      .status(status)
      .json({ ok: false, error: err.status ? err.message : 'Failed to update the team member.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ ok: false, error: 'Team member not found.' });
  }
  const member = await TeamMember.findById(req.params.id);
  if (!member) return res.status(404).json({ ok: false, error: 'Team member not found.' });

  const photoId = member.photo;
  await member.deleteOne();
  await deletePhotoIfUnused(photoId);
  return res.json({ ok: true });
});

export default router;
