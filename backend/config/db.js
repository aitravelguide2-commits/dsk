import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hasMySQL = process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER;

let sequelize;
if (hasMySQL) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    { host: process.env.DB_HOST, dialect: 'mysql', logging: false }
  );
} else {
  const dataDir = path.join(__dirname, '../data');
  try { fs.mkdirSync(dataDir, { recursive: true }); } catch (e) { /* ignore */ }
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(dataDir, 'dev.sqlite'),
    logging: false,
  });
}

export default sequelize;
