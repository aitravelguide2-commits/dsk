import express from 'express'
import { PriceConfig, ChangeLog } from '../models/index.js'
import { authenticate, permit } from '../middleware/auth.js'

const router = express.Router()

const isPositiveMoney = (v) => typeof v === 'number' && v >= 0

router.get('/:accommodation_id', authenticate, permit('admin','editor'), async (req, res) => {
  const id = Number(req.params.accommodation_id)
  const cfg = await PriceConfig.findOne({ where: { accommodation_id: id } })
  res.json(cfg || null)
})

router.post('/', authenticate, permit('admin','editor'), async (req, res) => {
  const { accommodation_id, extra_costs, discounts } = req.body
  const id = Number(accommodation_id)
  if (!id) return res.status(400).json({ msg: 'Ungültige Eingabe' })
  const created = await PriceConfig.create({ accommodation_id: id, extra_costs: extra_costs || {}, discounts: discounts || [] })
  await ChangeLog.create({ entity: 'PriceConfig', entity_id: String(id), action: 'create', payload: created.toJSON(), user_id: req.user?.id })
  res.status(201).json(created)
})

router.put('/:accommodation_id', authenticate, permit('admin','editor'), async (req, res) => {
  const id = Number(req.params.accommodation_id)
  const { extra_costs, discounts } = req.body
  const cfg = await PriceConfig.findOne({ where: { accommodation_id: id } })
  if (!cfg) return res.status(404).json({ msg: 'Nicht gefunden' })
  await cfg.update({
    extra_costs: extra_costs != null ? extra_costs : cfg.extra_costs,
    discounts: discounts != null ? discounts : cfg.discounts
  })
  await ChangeLog.create({ entity: 'PriceConfig', entity_id: String(id), action: 'update', payload: req.body, user_id: req.user?.id })
  res.json(cfg)
})

router.delete('/:accommodation_id', authenticate, permit('admin'), async (req, res) => {
  const id = Number(req.params.accommodation_id)
  await PriceConfig.destroy({ where: { accommodation_id: id } })
  await ChangeLog.create({ entity: 'PriceConfig', entity_id: String(id), action: 'delete', payload: null, user_id: req.user?.id })
  res.json({ msg: 'gelöscht' })
})

export default router