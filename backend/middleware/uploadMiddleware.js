import multer from 'multer';
import path from 'path';

// Store uploaded videos and thumbnails on disk; only their URLs are saved in MongoDB.
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Generate unique filename preserving original extension
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
});
