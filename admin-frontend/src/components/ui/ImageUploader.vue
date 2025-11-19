<template>
  <div class="modern-image-uploader">
    <!-- Upload Header -->
    <div class="upload-header">
      <div class="header-info">
        <h3 class="upload-title">Bilder</h3>
        <p class="upload-subtitle">Fügen Sie mindestens 5 Bilder hinzu. Je mehr, desto besser!</p>
      </div>
      <div class="header-actions">
        <q-select 
          v-model="quality" 
          :options="qualityOptions" 
          label="Qualität" 
          dense 
          outlined 
          style="min-width: 160px"
          class="quality-select"
        />
        <q-btn 
          color="primary" 
          icon="add_photo_alternate"
          label="Bilder hinzufügen"
          @click="$refs.fileInput.click()"
          unelevated
          class="add-btn"
        />
        <input 
          ref="fileInput" 
          type="file" 
          multiple 
          accept=".jpg,.jpeg,.png,.webp" 
          @change="handleFiles" 
          style="display:none" 
        />
      </div>
    </div>

    <!-- Drop Zone (shown when no images) -->
    <div 
      v-if="!images || images.length === 0"
      class="drop-zone"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="handleDrop"
      :class="{ 'drag-over': dragOver }"
      @click="$refs.fileInput.click()"
    >
      <div class="drop-zone-content">
        <q-icon name="cloud_upload" size="64px" color="primary" />
        <h4 class="drop-title">Bilder hierher ziehen oder klicken</h4>
        <p class="drop-subtitle">JPG, PNG oder WebP (max. 10MB pro Bild)</p>
        <q-btn 
          label="Bilder auswählen" 
          color="primary" 
          outline
          class="q-mt-md"
        />
      </div>
    </div>

    <!-- Image Grid -->
    <div v-else class="image-grid">
      <div
        v-for="(img, idx) in images"
        :key="img.filename"
        class="image-item"
        :class="{ 'is-cover': idx === 0 }"
        draggable="true"
        @dragstart="onDragStart(idx)"
        @dragover.prevent
        @drop="onDrop(idx)"
      >
        <!-- Cover Badge -->
        <div v-if="idx === 0" class="cover-badge">
          <q-icon name="star" size="16px" />
          <span>Titelbild</span>
        </div>

        <!-- Image Preview -->
        <div class="image-preview" @click="openLightbox(idx)">
          <img :src="displayUrl(img.url)" :alt="img.title || ''" />
          <div class="image-overlay">
            <q-btn 
              round 
              flat 
              icon="zoom_in" 
              color="white"
              size="md"
            />
          </div>
        </div>

        <!-- Image Actions -->
        <div class="image-actions">
          <q-btn 
            dense 
            flat 
            round 
            icon="delete" 
            color="negative"
            @click.stop="confirmRemove(img.filename)"
            :loading="progress[img.filename] === -1"
            class="delete-btn"
          >
            <q-tooltip>Löschen</q-tooltip>
          </q-btn>
          <q-btn 
            v-if="idx !== 0"
            dense 
            flat 
            round 
            icon="star_border" 
            @click.stop="onSetCover(idx)"
            class="star-btn"
          >
            <q-tooltip>Als Titelbild setzen</q-tooltip>
          </q-btn>
        </div>

        <!-- Progress Bar -->
        <div v-if="progress[img.filename] >= 0 && progress[img.filename] < 100" class="progress-bar">
          <div class="progress-fill" :style="{ width: progress[img.filename] + '%' }"></div>
        </div>

        <!-- Image Caption -->
        <div class="image-caption">
          <q-input 
            v-model="img.title" 
            dense 
            filled
            placeholder="Bildtitel hinzufügen..."
            class="caption-input"
          />
        </div>

        <!-- Drag Handle -->
        <div class="drag-handle">
          <q-icon name="drag_indicator" size="20px" />
        </div>
      </div>

      <!-- Add More Button -->
      <div class="add-more-card" @click="$refs.fileInput.click()">
        <div class="add-more-content">
          <q-icon name="add_circle_outline" size="48px" color="primary" />
          <span class="add-more-text">Weitere Bilder hinzufügen</span>
        </div>
      </div>
    </div>

    <!-- Image Count Info -->
    <div v-if="images && images.length > 0" class="image-info">
      <div class="info-item">
        <q-icon name="photo_library" size="20px" />
        <span>{{ images.length }} {{ images.length === 1 ? 'Bild' : 'Bilder' }}</span>
      </div>
      <div class="info-item">
        <q-icon name="info" size="20px" />
        <span>Ziehen Sie Bilder, um die Reihenfolge zu ändern</span>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="preview" class="lightbox" @click="closeLightbox">
      <button class="lightbox-close" @click.stop="closeLightbox" aria-label="Schließen">
        <q-icon name="close" size="24px" />
      </button>
      <div class="lightbox-count">{{ current + 1 }} / {{ images.length }}</div>
      <button v-if="images.length > 1" class="lightbox-prev" @click.stop="prevImage" aria-label="Vorheriges Bild">
        <q-icon name="chevron_left" size="32px" />
      </button>
      <button v-if="images.length > 1" class="lightbox-next" @click.stop="nextImage" aria-label="Nächstes Bild">
        <q-icon name="chevron_right" size="32px" />
      </button>
      <div class="lightbox-body" @click.stop>
        <img :src="displayUrl(images[current]?.url)" :alt="images[current]?.title || ''" class="lightbox-img" />
        <div class="lightbox-caption">
          <div class="title">{{ images[current]?.title || 'Kein Titel' }}</div>
          <div class="sub">Bild {{ current + 1 }} von {{ images.length }}</div>
        </div>
      </div>
      <div class="lightbox-thumbs">
        <button 
          v-for="(img, idx) in images" 
          :key="img.filename || idx" 
          @click.stop="setCurrent(idx)" 
          :class="['thumb', idx === current ? 'thumb-active' : '']"
        >
          <img :src="displayUrl(img.url)" alt="" />
        </button>
      </div>
      <div class="lightbox-help">← → Navigation · ESC Schließen</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted, watch } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps(['id', 'images'])
const emit = defineEmits(['uploaded', 'delete-image'])
const $q = useQuasar()
const dragIndex = ref(null)
const dragOver = ref(false)

const baseURL = (import.meta.env.VITE_API_URL ?? (location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api'))
const uploadsBase = computed(() => baseURL.replace(/\/$/, '').replace(/\/api$/, ''))
const quality = ref('none')
const qualityOptions = [
  { label: 'Keine Komprimierung', value: 'none' },
  { label: 'Hoch', value: 'high' },
  { label: 'Mittel', value: 'medium' },
  { label: 'Niedrig', value: 'low' }
]

const preview = ref(false)
const current = ref(0)
const progress = ref({})

function onSetCover(idx) {
  if (idx === 0) return
  const next = props.images.slice()
  const [item] = next.splice(idx, 1)
  next.unshift(item)
  normalizeOrderAndCover(next)
  emit('uploaded', next)
  $q.notify({ message: 'Titelbild aktualisiert', color: 'positive', icon: 'check', position: 'top-right' })
}

function onDragStart(idx) {
  dragIndex.value = idx
}

function onDrop(targetIdx) {
  if (dragIndex.value === null || dragIndex.value === targetIdx) return
  const next = props.images.slice()
  const [moved] = next.splice(dragIndex.value, 1)
  next.splice(targetIdx, 0, moved)
  dragIndex.value = null
  normalizeOrderAndCover(next)
  emit('uploaded', next)
}

function confirmRemove(filename) {
  $q.dialog({
    title: 'Bild löschen?',
    message: 'Möchten Sie dieses Bild wirklich löschen?',
    cancel: { label: 'Abbrechen', flat: true },
    ok: { label: 'Löschen', color: 'negative', unelevated: true },
    class: 'modern-dialog'
  }).onOk(() => deleteImage(filename))
}

async function deleteImage(filename) {
  if (!props.id || !filename) {
    console.error('Delete image failed: missing id or filename', { id: props.id, filename })
    $q.notify({ message: 'Fehler: ID oder Dateiname fehlt', color: 'negative', icon: 'error', position: 'top-right' })
    return
  }
  
  console.log('Deleting image:', { id: props.id, filename, baseURL })
  
  try {
    progress.value[filename] = -1
    const t = localStorage.token
    const url = `${baseURL}/accommodations/${props.id}/images/${encodeURIComponent(filename)}`
    
    console.log('DELETE request to:', url)
    
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    
    console.log('DELETE response:', { status: resp.status, ok: resp.ok })
    
    if (!resp.ok) {
      const text = await resp.text()
      console.error('DELETE failed:', text)
      
      // Check if token is invalid (403)
      if (resp.status === 403) {
        $q.notify({ 
          message: 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.', 
          color: 'warning', 
          icon: 'warning', 
          position: 'top-right',
          timeout: 3000
        })
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
        return
      }
      
      throw new Error(text || `HTTP ${resp.status}`)
    }
    const remaining = await resp.json()
    console.log('Remaining images:', remaining)
    
    const next = Array.isArray(remaining) ? remaining.map(r => ({
      ...r,
      url: r?.url?.startsWith('/uploads') ? `${uploadsBase.value}${r.url}` : r.url
    })) : props.images.filter(i => i.filename !== filename)
    normalizeOrderAndCover(next)
    emit('uploaded', next)
    $q.notify({ message: 'Bild gelöscht', color: 'positive', icon: 'check', position: 'top-right' })
  } catch (err) {
    console.error('Delete image error:', err)
    $q.notify({ message: `Löschen fehlgeschlagen: ${err.message}`, color: 'negative', icon: 'error', position: 'top-right' })
  } finally {
    delete progress.value[filename]
  }
}

function normalizeOrderAndCover(list) {
  list.forEach((img, i) => { img.order = i; img.isCover = i === 0 })
}

function openLightbox(idx) { current.value = idx; preview.value = true }
function closeLightbox() { preview.value = false }
function nextImage() { current.value = (current.value + 1) % (props.images?.length || 1) }
function prevImage() { current.value = (current.value - 1 + (props.images?.length || 1)) % (props.images?.length || 1) }
function setCurrent(idx) { current.value = idx }

function onKey(e) {
  if (!preview.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

watch(preview, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKey)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

function displayUrl(url) {
  if (!url) return ''
  return url.startsWith('/uploads') ? `${uploadsBase.value}${url}` : url
}

async function handleDrop(e) {
  dragOver.value = false
  const files = Array.from(e.dataTransfer.files || [])
  await processFiles(files)
}

async function handleFiles(e) {
  const files = Array.from(e.target.files || [])
  await processFiles(files)
  e.target.value = ''
}

async function processFiles(files) {
  if (!files.length) return
  for (const f of files) {
    if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(f.type)) {
      $q.notify({ message: `${f.name}: Ungültiges Format`, color: 'negative', icon: 'error' })
      continue
    }
    if (f.size > 10 * 1024 * 1024) {
      $q.notify({ message: `${f.name}: Datei zu groß (max 10MB)`, color: 'negative', icon: 'error' })
      continue
    }
    const processed = await compressClient(f, quality.value)
    await uploadWithProgress(processed)
  }
}

function compressClient(file, q) {
  const type = file.type
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const qualityMap = { high: 0.9, medium: 0.85, low: 0.75 }
        const mime = type === 'image/jpeg' || type === 'image/jpg' ? 'image/jpeg' : (type === 'image/webp' ? 'image/webp' : 'image/png')
        const qv = (mime === 'image/png' || q === 'none') ? undefined : (qualityMap[q] || 0.85)
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Blob leer'))
          const out = new File([blob], file.name, { type: mime, lastModified: Date.now() })
          resolve(out)
        }, mime, qv)
      }
      img.onerror = reject
      img.src = ev.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function uploadWithProgress(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const url = `${baseURL}/accommodations/${props.id}/images?quality=none`
    xhr.open('POST', url)
    const t = localStorage.token
    if (t) xhr.setRequestHeader('Authorization', `Bearer ${t}`)
    const fd = new FormData()
    fd.append('images', file)
    progress.value[file.name] = 0
    xhr.upload.onprogress = (evt) => { if (evt.lengthComputable) progress.value[file.name] = Math.round((evt.loaded / evt.total) * 100) }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const resp = JSON.parse(xhr.responseText)
            const next = Array.isArray(resp) ? resp.map(r => ({ ...r, url: r?.url?.startsWith('/uploads') ? `${uploadsBase.value}${r.url}` : r.url })) : props.images
            normalizeOrderAndCover(next)
            emit('uploaded', next)
            $q.notify({ message: 'Bild hochgeladen', color: 'positive', icon: 'check', position: 'top-right' })
            resolve(resp)
          } catch (e) { reject(e) }
        } else { reject(new Error(`HTTP ${xhr.status}`)) }
        setTimeout(() => delete progress.value[file.name], 1000)
      }
    }
    xhr.onerror = () => { progress.value[file.name] = 0; reject(new Error('Upload-Fehler')) }
    xhr.send(fd)
  })
}
</script>

<style scoped>
.modern-image-uploader {
  width: 100%;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-info {
  flex: 1;
}

.upload-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.upload-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.quality-select :deep(.q-field__control) {
  border-radius: 10px;
}

.add-btn {
  height: 40px;
  border-radius: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.drop-zone {
  border: 3px dashed #cbd5e1;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.drop-zone:hover, .drop-zone.drag-over {
  border-color: #667eea;
  background: #f1f5f9;
  transform: scale(1.01);
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.drop-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.drop-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.image-item {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 16px;
  overflow: hidden;
  background: #f8fafc;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: move;
}

.image-item:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.image-item.is-cover {
  border-color: #f59e0b;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.cover-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #f59e0b;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.image-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.delete-btn, .star-btn {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  color: white;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.star-btn:hover {
  background: #f59e0b;
  transform: scale(1.1);
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 20;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 8px;
}

.caption-input :deep(.q-field__control) {
  border-radius: 8px;
  min-height: 36px;
}

.drag-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.image-item:hover .drag-handle {
  opacity: 1;
}

.add-more-card {
  aspect-ratio: 4/3;
  border: 3px dashed #cbd5e1;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.add-more-card:hover {
  border-color: #667eea;
  background: #f1f5f9;
  transform: scale(1.02);
}

.add-more-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.add-more-text {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.image-info {
  display: flex;
  gap: 24px;
  margin-top: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

/* Lightbox Styles */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 0;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.lightbox-count {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 10px 16px;
  border-radius: 24px;
  font-weight: 600;
}

.lightbox-prev, .lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 0;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lightbox-prev:hover, .lightbox-next:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }

.lightbox-body {
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-caption {
  margin-top: 16px;
  color: white;
  text-align: center;
}

.lightbox-caption .title {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 4px;
}

.lightbox-caption .sub {
  opacity: 0.7;
  font-size: 14px;
}

.lightbox-thumbs {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow-x: auto;
  max-width: 90vw;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid transparent;
  padding: 0;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb:hover {
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.thumb-active {
  border-color: white;
  transform: scale(1.1);
}

.lightbox-help {
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .upload-header {
    flex-direction: column;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .quality-select {
    width: 100%;
  }
  
  .add-btn {
    width: 100%;
  }
}
</style>
