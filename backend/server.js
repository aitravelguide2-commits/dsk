import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import sequelize from './config/db.js';
// Modelle und Relationen initialisieren (Side-Effect Import)
import './models/index.js';
import routes from './routes/index.js';
import errorHandler from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from project root to share keys across FE/BE
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists and serve static files
const uploadDir = path.join(__dirname, process.env.UPLOAD_PATH || 'uploads/images');
fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', cors(), express.static(uploadDir));

// Initialise DB
try {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('✅ DB synchronised');
} catch (err) {
  console.error('❌ DB connection failed:', err.message);
}

// API routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 API on http://localhost:${port}`);
});
