import multer from 'multer';

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB

// Files are kept in memory, validated, then saved to MongoDB. Nothing is written to disk.
export const uploadSingleImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
}).single('image');