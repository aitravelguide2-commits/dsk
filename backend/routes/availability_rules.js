import express from 'express'
import { AvailabilityRule, ChangeLog } from '../models/index.js'
import { authenticate, permit } from '../middleware/auth.js'
import { Op } from 'sequelize'

const router = express.Router()

function overlaps(aStart, aEnd, bStart, bEnd) {
  return !(new Date(aEnd) < new Date(bStart) || new Date(aStart) > new Date(bEnd))
}

router.get('/', authenticate, permit('admin','editor'), async (req, res) => {
  const { accommodation_id } = req.query
  const where = accommodation_id ? { accommodation_id: Number(accommodation_id) } : {}
  const list = await AvailabilityRule.findAll({ where, order: [['start_date','ASC']] })
  res.json(list)
})

router.post('/', authenticate, permit('admin','editor'), async (req, res) => {
  const payload = req.body
  const id = Number(payload.accommodation_id)
  if (!id || !payload.type || !payload.start_date || !payload.end_date) return res.status(400).json({ msg: 'Ungültige Eingabe' })
  if (new Date(payload.end_date) < new Date(payload.start_date)) return res.status(400).json({ msg: 'Zeitraum ungültig' })

  // conflict detection for same-type ranges
  const sameType = await AvailabilityRule.findAll({ where: { accommodation_id: id, type: payload.type } })
  const conflict = sameType.find(r => overlaps(payload.start_date, payload.end_date, r.start_date, r.end_date))
  if (conflict && (payload.type === 'season' || payload.type === 'block')) {
    return res.status(409).json({ msg: 'Konflikt mit vorhandenem Zeitraum', conflictWith: conflict })
  }
  const created = await AvailabilityRule.create(payload)
  await ChangeLog.create({ entity: 'AvailabilityRule', entity_id: String(created.id), action: 'create', payload, user_id: req.user?.id })
  res.status(201).json(created)
})

router.put('/:id', authenticate, permit('admin','editor'), async (req, res) => {
  const rule = await AvailabilityRule.findByPk(req.params.id)
  if (!rule) return res.status(404).json({ msg: 'Nicht gefunden' })
  const next = { ...rule.toJSON(), ...req.body }
  if (!next.start_date || !next.end_date) return res.status(400).json({ msg: 'Ungültige Eingabe' })
  if (new Date(next.end_date) < new Date(next.start_date)) return res.status(400).json({ msg: 'Zeitraum ungültig' })
  const sameType = await AvailabilityRule.findAll({ where: { accommodation_id: rule.accommodation_id, type: next.type } })
  const conflict = sameType.find(r => r.id !== rule.id && overlaps(next.start_date, next.end_date, r.start_date, r.end_date))
  if (conflict && (next.type === 'season' || next.type === 'block')) {
    return res.status(409).json({ msg: 'Konflikt mit vorhandenem Zeitraum', conflictWith: conflict })
  }
  await rule.update(req.body)
  await ChangeLog.create({ entity: 'AvailabilityRule', entity_id: String(rule.id), action: 'update', payload: req.body, user_id: req.user?.id })
  res.json(rule)
})

router.delete('/:id', authenticate, permit('admin','editor'), async (req, res) => {
  await AvailabilityRule.destroy({ where: { id: req.params.id } })
  await ChangeLog.create({ entity: 'AvailabilityRule', entity_id: String(req.params.id), action: 'delete', payload: null, user_id: req.user?.id })
  res.json({ msg: 'gelöscht' })
})

export default router