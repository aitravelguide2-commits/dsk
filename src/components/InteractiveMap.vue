<template>
  <div class="map-container" role="application" aria-label="Interaktive Karte">
    <div :id="mapId" class="map" :style="{ height: height, width: '100%' }"></div>
    <div v-if="isLoading" class="loading-overlay" aria-live="polite" aria-busy="true">
      <div class="spinner"></div>
    </div>
    <div v-if="showDirections || showSurroundingsLink" class="map-actions">
      <a v-if="showDirections" :href="directionsHref" target="_blank" rel="noopener" class="action-btn">Wegbeschreibung</a>
      <a v-if="showSurroundingsLink" :href="surroundingsHref" target="_blank" rel="noopener" class="action-btn">Umgebung</a>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'

export default {
  name: 'InteractiveMap',
  props: {
    center: {
      type: Array,
      default: () => [51.3397, 12.3731] // Leipzig coordinates
    },
    zoom: {
      type: Number,
      default: 13
    },
    height: {
      type: String,
      default: '400px'
    },
    markers: {
      type: Array,
      default: () => []
    },
    mapId: {
      type: String,
      default: () => `map-${Math.random().toString(36).substr(2, 9)}`
    },
    useBrowserGeolocation: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
      default: ''
    },
    showDirections: {
      type: Boolean,
      default: false
    },
    showSurroundingsLink: {
      type: Boolean,
      default: false
    },
    markerIcon: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      map: null,
      markerLayer: null,
      resizeHandler: null,
      isLoading: true,
      lastResolvedLocation: null
    }
  },
  computed: {
    directionsHref() {
      const destLat = this.center?.[0] || 0
      const destLng = this.center?.[1] || 0
      const from = this.lastResolvedLocation
      if (from && typeof from.lat === 'number' && typeof from.lng === 'number') {
        return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${from.lat},${from.lng};${destLat},${destLng}`
      }
      return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`
    },
    surroundingsHref() {
      const z = this.zoom || 14
      const destLat = this.center?.[0] || 0
      const destLng = this.center?.[1] || 0
      return `https://www.openstreetmap.org/#map=${z}/${destLat}/${destLng}`
    }
  },
  mounted() {
    this.initMap()
    this.initResizeHandler()
    this.tryGeocode()
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
  },
  watch: {
    markers: {
      handler() {
        this.updateMarkers()
      },
      deep: true
    }
  },
  methods: {
    initMap() {
      // Initialize the map
      this.map = L.map(this.mapId).setView(this.center, this.zoom)

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(this.map)
      this.map.once('load', () => { this.isLoading = false })

      // Create marker layer group
      this.markerLayer = L.layerGroup().addTo(this.map)

      // Add markers if provided
      this.updateMarkers()

      // Fix for Leaflet icon issue in bundlers
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.0/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.0/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.0/images/marker-shadow.png'
      })

      // Optional: Try browser geolocation
      if (this.useBrowserGeolocation && navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords
              this.setView(latitude, longitude, this.zoom)
              const icon = this.resolveIcon()
              const geoMarker = icon ? L.marker([latitude, longitude], { icon }) : L.marker([latitude, longitude])
              geoMarker.bindPopup('Ihr Standort')
              geoMarker.addTo(this.markerLayer)
              this.lastResolvedLocation = { lat: latitude, lng: longitude }
              this.$emit && this.$emit('locationResolved', { lat: latitude, lng: longitude })
            },
            (err) => {
              this.$emit && this.$emit('error', { code: err.code, message: err.message })
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
          )
        } catch (e) {
          this.$emit && this.$emit('error', { message: 'Geolocation nicht verfügbar' })
        }
      }
    },
    async tryGeocode() {
      if (!this.address || !this.address.trim()) return
      try {
        this.isLoading = true
        const q = encodeURIComponent(this.address)
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}`
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } })
        const arr = await resp.json()
        const best = Array.isArray(arr) && arr.length ? arr[0] : null
        if (best) {
          const lat = parseFloat(best.lat), lon = parseFloat(best.lon)
          this.setView(lat, lon, 16)
          const icon = this.resolveIcon()
          const m = icon ? L.marker([lat, lon], { icon }) : L.marker([lat, lon])
          m.bindPopup(this.address)
          m.addTo(this.markerLayer)
        }
      } catch (e) {
        // ignore
      } finally {
        this.isLoading = false
      }
    },
    updateMarkers() {
      if (!this.markerLayer) return

      // Clear existing markers
      this.markerLayer.clearLayers()

      // Add new markers
      const icon = this.resolveIcon()
      this.markers.forEach(marker => {
        const leafletMarker = icon ? L.marker([marker.lat, marker.lng], { icon }) : L.marker([marker.lat, marker.lng])
        
        if (marker.popup) {
          leafletMarker.bindPopup(marker.popup)
        }
        
        if (marker.tooltip) {
          leafletMarker.bindTooltip(marker.tooltip)
        }

        leafletMarker.addTo(this.markerLayer)
      })

      // Fit map to markers if multiple markers exist
      if (this.markers.length > 1) {
        const group = new L.featureGroup(this.markerLayer.getLayers())
        this.map.fitBounds(group.getBounds().pad(0.1))
      }
    },
    addMarker(lat, lng, popup = null, tooltip = null) {
      const marker = { lat, lng, popup, tooltip }
      this.markers.push(marker)
    },
    removeAllMarkers() {
      if (this.markerLayer) {
        this.markerLayer.clearLayers()
      }
    },
    setView(lat, lng, zoom = null) {
      if (this.map) {
        this.map.setView([lat, lng], zoom || this.zoom)
      }
    },
    initResizeHandler() {
      this.resizeHandler = () => {
        if (this.map) {
          this.map.invalidateSize()
        }
      }
      window.addEventListener('resize', this.resizeHandler)
    },
    resolveIcon() {
      if (!this.markerIcon) return null
      const opts = { ...this.markerIcon }
      return L.icon(opts)
    }
  }
}
</script>

<style scoped>
.map-container {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 0;
}

.map {
  border-radius: 0.5rem;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.6);
  z-index: 25;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.map-actions {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 8px;
  z-index: 35;
}

.action-btn {
  background: white;
  color: #1f2937;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
}

/* Fix for Leaflet controls */
:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

:deep(.leaflet-control-zoom a) {
  background-color: white !important;
  color: #374151 !important;
  border: 1px solid #d1d5db !important;
}

:deep(.leaflet-control-zoom a:hover) {
  background-color: #f3f4f6 !important;
}

:deep(.leaflet-top),
:deep(.leaflet-bottom),
:deep(.leaflet-control) {
  z-index: 30 !important; /* Ensure header (z-50) overlays map controls */
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 0.5rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}

:deep(.leaflet-popup-tip) {
  background: white !important;
}
</style>
