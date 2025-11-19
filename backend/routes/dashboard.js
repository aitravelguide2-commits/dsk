import express from 'express';
import { sequelize, Booking, Accommodation } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/stats', async (req, res) => {
  const [[{ totalBookings, totalRevenue }]] = await sequelize.query(
    "SELECT COUNT(*) AS totalBookings, COALESCE(SUM(total_price),0) AS totalRevenue FROM Bookings WHERE status IN ('confirmed', 'completed')"
  );
  const totalAcc = await sequelize.models.Accommodation.count();
  const pending = await sequelize.models.Booking.count({ where: { status: 'pending' } });
  res.json({ totalBookings, totalRevenue, totalAccommodations: totalAcc, pendingBookings: pending });
});

router.get('/bookings-by-month', async (req, res) => {
  const { start, end } = req.query;
  const [[{ count }]] = await sequelize.query(
    'SELECT COUNT(*) AS count FROM Bookings WHERE createdAt BETWEEN ? AND ?',
    { replacements: [start, end] }
  );
  res.json({ count });
});

export default router;
// Chart-Daten: letzte 12 Monate Buchungen & Umsatz
router.get('/chart-data', async (req, res) => {
  const now = new Date();
  const labels = [];
  const bookingsPerMonth = [];
  const revenuePerMonth = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

    const rows = await Booking.findAll({
      where: { createdAt: { [Op.between]: [start, end] } },
      attributes: ['total_price']
    });
    labels.push(label);
    bookingsPerMonth.push(rows.length);
    revenuePerMonth.push(rows.reduce((sum, r) => sum + Number(r.total_price || 0), 0));
  }

  res.json({
    labels,
    datasets: [
      { label: 'Buchungen', data: bookingsPerMonth },
      { label: 'Umsatz',    data: revenuePerMonth }
    ]
  });
});

// Letzte Buchungen
router.get('/recent-bookings', async (req, res) => {
  const recent = await Booking.findAll({ order: [['createdAt','DESC']], limit: 10 });
  res.json(recent);
});
