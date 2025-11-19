import express from 'express';
import { PageContent } from '../models/index.js';
import { authenticate, permit } from '../middleware/auth.js';

const router = express.Router();

// List all entries or filter by page
router.get('/', async (req, res) => {
  const { page } = req.query;
  const where = page ? { page } : {};
  const list = await PageContent.findAll({ where, order: [['updatedAt', 'DESC']] });
  res.json(list);
});

// Get a single section
router.get('/:id', authenticate, async (req, res) => {
  const entry = await PageContent.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ msg: 'Nicht gefunden' });
  res.json(entry);
});

// Upsert by page+section
router.post('/', authenticate, permit('admin','editor'), async (req, res) => {
  const { page, section, content, last_modified_by } = req.body;
  const [entry, created] = await PageContent.findOrCreate({
    where: { page, section },
    defaults: { content, last_modified_by },
  });
  if (!created) {
    await entry.update({ content, last_modified_by });
  }
  res.status(created ? 201 : 200).json(entry);
});

router.put('/:id', authenticate, permit('admin','editor'), async (req, res) => {
  const entry = await PageContent.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ msg: 'Nicht gefunden' });
  await entry.update(req.body);
  res.json(entry);
});

router.delete('/:id', authenticate, permit('admin'), async (req, res) => {
  await PageContent.destroy({ where: { id: req.params.id } });
  res.json({ msg: 'gelöscht' });
});

export default router;
