import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';

// Ensure destination exists
const dest = process.env.UPLOAD_PATH || 'uploads/images';
fs.mkdirSync(dest, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dest),
  filename: (req, file, cb) =>
    cb(null, `${randomBytes(8).toString('hex')}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) =>
  /jpe?g|png|webp/i.test(path.extname(file.originalname))
    ? cb(null, true)
    : cb(new Error('Nur Bilder'));

export default multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
