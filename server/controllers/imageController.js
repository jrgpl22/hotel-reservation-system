import Image from '../models/Image.js';
import { detectImageType } from '../utils/detectImageType.js';

// @route POST /api/images/room | /api/images/avatar
export const uploadImage = (kind) => async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please choose an image to upload');
    }

    const contentType = detectImageType(req.file.buffer);
    if (!contentType) {
      res.status(400);
      throw new Error('Only JPG, PNG, or WebP images are allowed');
    }

    const image = await Image.create({
      data: req.file.buffer,
      contentType,
      size: req.file.size,
      kind,
      uploadedBy: req.user.id,
    });

    res.status(201).json({ success: true, path: `/api/images/${image._id}` });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/images/:id  (public, so guests can see room photos)
export const getImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id).select('data contentType');
    if (!image) {
      res.status(404);
      throw new Error('Image not found');
    }

    res.set({
      'Content-Type': image.contentType,
      // Every upload gets a new id, so a stored image never changes and can be cached for good
      'Cache-Control': 'public, max-age=31536000, immutable',
      // helmet defaults to same-origin, which would block the frontend (port 5173) from showing these
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.send(image.data);
  } catch (error) {
    next(error);
  }
};