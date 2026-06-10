import { Router } from 'express';
import mongoose from 'mongoose';
import ImageAsset from '../models/ImageAsset.js';

const router = Router();

// GET /api/images/:id — serve a stored file (vehicle photo / brochure PDF).
// Assets are immutable (edits create a new asset), so cache aggressively.
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).end();
  }
  const asset = await ImageAsset.findById(req.params.id);
  if (!asset) return res.status(404).end();

  res.set({
    'Content-Type': asset.contentType,
    'Content-Length': asset.size,
    'Cache-Control': 'public, max-age=31536000, immutable',
  });
  return res.send(asset.data);
});

export default router;
