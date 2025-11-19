import express from 'express';
import { Booking, Accommodation } from '../models/index.js';
import { Op } from 'sequelize';
import { authenticate, permit } from '../middleware/auth.js';

const router = express.Router();

// List with filters: status, date range
router.get('/', authenticate, async (req, res) => {
  const { status, start, end, accommodation_id } = req.query;
  const where = {};
  if (status) where.status = status;
  if (start && end) where.createdAt = { [Op.between]: [new Date(start), new Date(end)] };
  if (accommodation_id) where.accommodation_id = Number(accommodation_id);
  const list = await Booking.findAll({ where, order: [['updatedAt', 'DESC']] });
  res.json(list);
});

router.get('/:id', authenticate, async (req, res) => {
  const bk = await Booking.findByPk(req.params.id);
  if (!bk) return res.status(404).json({ msg: 'Nicht gefunden' });
  res.json(bk);
});

router.post('/', authenticate, permit('admin','editor'), async (req, res) => {
  try {
    const payload = { ...req.body }
    const isAdminBlock = /Admin blockiert/i.test(String(payload.notes || ''))
    if (!isAdminBlock && payload.accommodation_id && payload.check_in && payload.check_out) {
      const acc = await Accommodation.findByPk(payload.accommodation_id)
      if (!acc) return res.status(400).json({ msg: 'Unterkunft nicht gefunden' })
      const pin = new Date(String(payload.check_in))
      const pout = new Date(String(payload.check_out))
      const dayMs = 24 * 60 * 60 * 1000
      const nights = Math.ceil((pout.getTime() - pin.getTime()) / dayMs)
      const pricePerNight = Number(acc.price_per_night || 0)
      const base = pricePerNight * nights
      const cleaningFeeDefault = Number(process.env.CLEANING_FEE || 40)
      const cleaningThresholdDefault = Number(process.env.CLEANING_FEE_THRESHOLD || 4)
      const cleaningFee = Number(payload.cleaningFee ?? cleaningFeeDefault)
      const cleaningFeeThreshold = Number(payload.cleaningFeeThreshold ?? cleaningThresholdDefault)
      const applies = nights >= cleaningFeeThreshold
      payload.total_price = base + (applies ? cleaningFee : 0)
      payload.notes = String(payload.notes || '') + (applies ? `\nReinigungsgebühr: €${cleaningFee} (ab ${cleaningFeeThreshold} Nächten)` : '')
    }
    const created = await Booking.create(payload)
    res.status(201).json(created)
  } catch (e) {
    res.status(500).json({ msg: e.message || 'Fehler' })
  }
});

router.put('/:id', authenticate, permit('admin','editor'), async (req, res) => {
  const bk = await Booking.findByPk(req.params.id);
  if (!bk) return res.status(404).json({ msg: 'Nicht gefunden' });
  await bk.update(req.body);
  res.json(bk);
});

router.delete('/:id', authenticate, permit('admin'), async (req, res) => {
  await Booking.destroy({ where: { id: req.params.id } });
  res.json({ msg: 'gelöscht' });
});

// CSV Export
router.get('/export.csv', authenticate, permit('admin','editor'), async (req, res) => {
  const list = await Booking.findAll({ order: [['createdAt', 'DESC']] });
  const header = ['id','accommodation_id','guest_name','guest_email','check_in','check_out','total_price','status','notes','createdAt'];
  const rows = list.map(b => [b.id,b.accommodation_id,b.guest_name,b.guest_email,b.check_in,b.check_out,b.total_price,b.status,(b.notes||'').replace(/\n/g,' '),b.createdAt.toISOString()]);
  const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="bookings.csv"');
  res.send(csv);
});

export default router;
