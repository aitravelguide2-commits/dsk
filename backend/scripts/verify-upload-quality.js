import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import http from 'http'

const root = process.cwd()
const uploadDir = path.resolve(root, process.env.UPLOAD_PATH || path.join('uploads', 'images'))

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(buf).digest('hex')
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', reject)
  })
}

async function main() {
  if (!fs.existsSync(uploadDir)) {
    console.error('Upload-Verzeichnis nicht gefunden:', uploadDir)
    process.exit(1)
  }
  const files = fs.readdirSync(uploadDir)
  if (!files.length) {
    console.log('Keine Dateien im Upload-Verzeichnis gefunden.')
    return
  }
  console.log('Prüfe', files.length, 'Dateien...')
  let ok = 0, fail = 0
  for (const f of files) {
    const local = path.join(uploadDir, f)
    const hashLocal = sha256File(local)
    const bufRemote = await httpGet(`http://localhost:${process.env.PORT || 5000}/uploads/${f}`)
    const hashRemote = crypto.createHash('sha256').update(bufRemote).digest('hex')
    const match = hashLocal === hashRemote
    console.log(`${f} -> local ${hashLocal} | remote ${hashRemote} | ${match ? 'OK' : 'MISMATCH'}`)
    match ? ok++ : fail++
  }
  console.log(`Fertig. OK=${ok}, MISMATCH=${fail}`)
  process.exit(fail ? 1 : 0)
}

main().catch((e) => { console.error('Fehler:', e.message); process.exit(1) })