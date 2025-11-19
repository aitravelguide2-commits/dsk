import express from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const router = express.Router()
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_PATH || path.join('uploads', 'images'))

router.get('/hash/:file', async (req, res) => {
  try {
    const file = path.join(uploadDir, req.params.file)
    if (!fs.existsSync(file)) return res.status(404).json({ msg: 'Datei nicht gefunden' })
    const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
    res.json({ filename: req.params.file, sha256: hash })
  } catch (e) {
    res.status(500).json({ msg: 'Hash-Berechnung fehlgeschlagen' })
  }
})

export default router