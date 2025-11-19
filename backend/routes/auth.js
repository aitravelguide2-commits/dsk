import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  res.status(501).json({ msg: 'Login wird über Supabase Auth abgewickelt.' });
});

router.get('/me', authenticate, (req, res) => res.json(req.user));

export default router;
