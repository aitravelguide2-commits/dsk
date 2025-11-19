<template>
  <transition name="lb-fade">
    <div v-if="show" class="fixed inset-0 z-[100] bg-black/85" role="dialog" aria-modal="true" :aria-label="ariaLabel">
      <div class="absolute top-4 right-4 flex gap-2">
        <button class="px-3 py-2 rounded-md bg-white/90 text-gray-900" @click="zoomOut" aria-label="Zoom out">−</button>
        <button class="px-3 py-2 rounded-md bg-white/90 text-gray-900" @click="zoomIn" aria-label="Zoom in">+</button>
        <button class="px-3 py-2 rounded-md bg-white/90 text-gray-900" @click="onClose" aria-label="Schließen">✕</button>
      </div>
      <div class="absolute inset-0 flex items-center justify-center select-none" @wheel.prevent="onWheel" @mousedown="onMouseDown" @mousemove.prevent="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp" @touchstart="onTouchStart" @touchmove.prevent="onTouchMove" @touchend="onTouchEnd">
        <img v-if="currentSrc" :src="currentSrc" :alt="currentAlt" class="max-h-[90vh] max-w-[92vw] object-contain will-change-transform" :style="imgTransformStyle" @load="onLoad" @dblclick="toggleZoom"/>
        <div v-if="loading" class="absolute w-10 h-10 rounded-full border-4 border-white/60 border-t-transparent animate-spin"></div>
      </div>
      <div class="absolute left-4 top-1/2 -translate-y-1/2">
        <button class="px-3 py-2 rounded-full bg-white/90 text-gray-900" @click="prev" aria-label="Vorheriges">‹</button>
      </div>
      <div class="absolute right-4 top-1/2 -translate-y-1/2">
        <button class="px-3 py-2 rounded-full bg-white/90 text-gray-900" @click="next" aria-label="Nächstes">›</button>
      </div>
      <div v-if="showCaption" class="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90vw] text-center text-white/90 text-sm md:text-base px-4 py-2 bg-black/40 rounded-lg">{{ currentAlt }}</div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Lightbox',
  props: {
    show: { type: Boolean, default: false },
    images: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    showCaption: { type: Boolean, default: true },
    ariaLabel: { type: String, default: 'Bildgalerie' }
  },
  data() {
    return {
      index: this.startIndex,
      scale: 1,
      panX: 0,
      panY: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      touchStartX: 0,
      touchStartY: 0,
      touchStartDist: 0,
      loading: true
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.index = this.startIndex
        this.resetTransform()
        this.loading = true
        document.addEventListener('keydown', this.onKey)
      } else {
        document.removeEventListener('keydown', this.onKey)
      }
    },
    startIndex(val) {
      this.index = val
      this.resetTransform()
      this.loading = true
    }
  },
  computed: {
    currentSrc() {
      const item = this.images[this.index]
      if (!item) return ''
      return typeof item === 'string' ? item : (item.url || '')
    },
    currentAlt() {
      const item = this.images[this.index]
      if (!item) return ''
      return typeof item === 'string' ? '' : (item.title || '')
    },
    imgTransformStyle() {
      return `transform: translate(${this.panX}px, ${this.panY}px) scale(${this.scale}); transition: transform 120ms ease`
    }
  },
  methods: {
    prev() {
      if (!this.images.length) return
      this.index = (this.index - 1 + this.images.length) % this.images.length
      this.resetTransform()
      this.loading = true
    },
    next() {
      if (!this.images.length) return
      this.index = (this.index + 1) % this.images.length
      this.resetTransform()
      this.loading = true
    },
    onClose() {
      this.$emit('close')
    },
    onKey(e) {
      if (e.key === 'Escape') this.onClose()
      else if (e.key === 'ArrowLeft') this.prev()
      else if (e.key === 'ArrowRight') this.next()
    },
    toggleZoom() {
      this.scale = this.scale > 1 ? 1 : 2
      if (this.scale === 1) { this.panX = 0; this.panY = 0 }
    },
    zoomIn() { this.scale = Math.min(this.scale + 0.25, 3) },
    zoomOut() { this.scale = Math.max(this.scale - 0.25, 1); if (this.scale === 1) { this.panX = 0; this.panY = 0 } },
    onWheel(e) {
      const delta = Math.sign(e.deltaY)
      if (delta > 0) this.zoomOut(); else this.zoomIn()
    },
    onMouseDown(e) { this.dragging = true; this.lastX = e.clientX; this.lastY = e.clientY },
    onMouseMove(e) {
      if (!this.dragging || this.scale === 1) return
      const dx = e.clientX - this.lastX
      const dy = e.clientY - this.lastY
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.panX += dx
      this.panY += dy
    },
    onMouseUp() { this.dragging = false },
    onTouchStart(e) {
      if (e.touches.length === 1) { this.touchStartX = e.touches[0].clientX; this.touchStartY = e.touches[0].clientY }
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        this.touchStartDist = Math.hypot(dx, dy)
      }
    },
    onTouchMove(e) {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.hypot(dx, dy)
        const factor = dist / (this.touchStartDist || dist)
        this.scale = Math.min(Math.max(factor, 1), 3)
        return
      }
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.touchStartX
        const dy = e.touches[0].clientY - this.touchStartY
        if (this.scale > 1) { this.panX = dx; this.panY = dy; return }
      }
    },
    onTouchEnd(e) {
      if (this.scale > 1) return
      const dx = (e.changedTouches && e.changedTouches[0]) ? (e.changedTouches[0].clientX - this.touchStartX) : 0
      if (dx > 50) this.prev(); else if (dx < -50) this.next()
    },
    onLoad() { this.loading = false },
    resetTransform() { this.scale = 1; this.panX = 0; this.panY = 0 }
  }
}
</script>

<style scoped>
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity .2s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }
</style>