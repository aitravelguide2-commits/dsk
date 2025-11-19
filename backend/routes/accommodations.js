import express from 'express';
import sharp from 'sharp';
import fs from 'fs'
import path from 'path'
import { getSupabase } from '../services/supabase.js';
import { authenticate, permit } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();
const ALLOWED_FIELDS = [
  'name','description','price_per_night','max_guests','is_active',
  'images','amenities','location','address','postal_code','connectivity',
  'details','about','house_rules','reviews','min_stay_nights',
  'property_type','floor','square_meters','bedrooms','bathrooms',
  'has_living_room','has_terrace'
]
const sanitize = (body) => Object.fromEntries(Object.entries(body || {}).filter(([k]) => ALLOWED_FIELDS.includes(k)))

router.get('/', authenticate, async (req, res) => {
  const { data, error } = await getSupabase()
    .from('accommodations')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) {
    console.error('[accommodations:list]', error)
    return res.status(500).json({ msg: 'Fehler beim Laden', details: error.message })
  }
  res.json(data || [])
});

router.get('/:id', authenticate, async (req, res) => {
  const { data, error } = await getSupabase()
    .from('accommodations')
    .select('*')
    .eq('id', req.params.id)
    .single()
  if (error?.code === 'PGRST116') return res.status(404).json({ msg: 'Nicht gefunden' })
  if (error) {
    console.error('[accommodations:get]', error)
    return res.status(500).json({ msg: 'Fehler', details: error.message })
  }
  res.json(data)
});

router.post('/', authenticate, permit('admin','editor'), async (req, res) => {
  const payload = sanitize(req.body)
  const { data, error } = await getSupabase()
    .from('accommodations')
    .insert(payload)
    .select()
    .single()
  if (error) {
    console.error('[accommodations:create]', error)
    return res.status(500).json({ msg: error.message || 'Fehler beim Erstellen', details: error.details || error.hint || null })
  }
  res.status(201).json(data)
});

router.put('/:id', authenticate, permit('admin','editor'), async (req, res) => {
  const payload = sanitize(req.body)
  const { data, error } = await getSupabase()
    .from('accommodations')
    .update(payload)
    .eq('id', req.params.id)
    .select()
    .single()
  if (error?.code === 'PGRST116') return res.status(404).json({ msg: 'Nicht gefunden' })
  if (error) {
    console.error('[accommodations:update]', error)
    return res.status(500).json({ msg: error.message || 'Fehler beim Aktualisieren', details: error.details || error.hint || null })
  }
  res.json(data)
});

router.delete('/:id', authenticate, permit('admin'), async (req, res) => {
  const { error } = await getSupabase()
    .from('accommodations')
    .delete()
    .eq('id', req.params.id)
  if (error) {
    console.error('[accommodations:delete]', error)
    return res.status(500).json({ msg: error.message || 'Fehler beim Löschen', details: error.details || error.hint || null })
  }
  res.json({ msg: 'gelöscht' })
});


router.post('/:id/images', authenticate, permit('admin','editor'), upload.array('images', 10), async (req, res) => {
  const { data: acc, error: gErr } = await getSupabase()
    .from('accommodations')
    .select('id,images')
    .eq('id', req.params.id)
    .single()
  if (gErr?.code === 'PGRST116') return res.status(404).json({ msg: 'Nicht gefunden' })
  if (gErr) return res.status(500).json({ msg: 'Fehler' })
  
  const q = String(req.query.quality || '').toLowerCase()
  const qualityMap = { high: 90, medium: 75, low: 60 }
  const pngLevel = { high: 9, medium: 6, low: 4 }
  
  for (const f of req.files) {
    if (q && q !== 'none' && (qualityMap[q] || pngLevel[q])) {
      const ext = (f.originalname.split('.').pop() || '').toLowerCase()
      try {
        const processor = sharp(f.path, { failOnError: false })
        if (ext === 'jpg' || ext === 'jpeg') await processor.jpeg({ quality: qualityMap[q], mozjpeg: true }).toFile(f.path)
        else if (ext === 'png') await processor.png({ compressionLevel: pngLevel[q] }).toFile(f.path)
        else if (ext === 'webp') await processor.webp({ quality: qualityMap[q] }).toFile(f.path)
      } catch (e) {
        console.error('[image compress]', f.filename, e.message)
      }
    }
  }
  
  const imgs = req.files.map(f => ({ url: `/uploads/${f.filename}`, filename: f.filename }))
  const nextImages = [ ...(acc?.images || []), ...imgs ]
  
  const { error } = await getSupabase()
    .from('accommodations')
    .update({ images: nextImages })
    .eq('id', req.params.id)
  if (error) return res.status(500).json({ msg: 'Fehler' })
  res.json(nextImages)
});

router.delete('/:id/images/:file', authenticate, permit('admin','editor'), async (req, res) => {
  // Relaxed origin check for development
  const origin = req.headers.origin || req.headers.referer || ''
  const allowedOrigins = [
    process.env.FRONTEND_ORIGIN || 'http://localhost:5175',
    'http://localhost:5175',
    'http://localhost:5174',
    'http://localhost:5173'
  ]
  
  if (origin && !allowedOrigins.some(allowed => String(origin).startsWith(allowed))) {
    console.warn('CSRF check failed:', { origin, allowedOrigins })
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ msg: 'CSRF Schutz: Origin nicht erlaubt' })
    }
  }
  
  const fname = String(req.params.file || '')
  console.log('Delete image request:', { id: req.params.id, filename: fname })
  
  if (!/^[a-f0-9]{16}\.(jpe?g|png|webp)$/i.test(fname)) {
    console.error('Invalid filename format:', fname)
    return res.status(400).json({ msg: 'Ungültige Bild-ID' })
  }
  
  const { data: acc, error: gErr } = await getSupabase()
    .from('accommodations')
    .select('id,images')
    .eq('id', req.params.id)
    .single()
  if (gErr?.code === 'PGRST116') return res.status(404).json({ msg: 'Nicht gefunden' })
  if (gErr) return res.status(500).json({ msg: 'Fehler' })
  
  const remaining = (acc?.images || []).filter(i => i.filename !== fname)
  
  const { error } = await getSupabase()
    .from('accommodations')
    .update({ images: remaining })
    .eq('id', req.params.id)
  if (error) {
    console.error('[accommodations:deleteImage]', error)
    return res.status(500).json({ msg: error.message || 'Fehler', details: error.details || null })
  }
  
  try {
    const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_PATH || path.join('uploads','images'))
    const filePath = path.join(uploadDir, fname)
    if (!filePath.startsWith(uploadDir)) throw new Error('Pfadvalidierung fehlgeschlagen')
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch (e) { /* ignore */ }
  
  res.json(remaining)
});

export default router;
