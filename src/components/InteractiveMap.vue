<template>
  <div class="map-container">
    <div :id="mapId" class="map" :style="{ height: height, width: '100%' }"></div>
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
    }
  },
  data() {
    return {
      map: null,
      markerLayer: null
    }
  },
  mounted() {
    this.initMap()
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
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
    },
    updateMarkers() {
      if (!this.markerLayer) return

      // Clear existing markers
      this.markerLayer.clearLayers()

      // Add new markers
      this.markers.forEach(marker => {
        const leafletMarker = L.marker([marker.lat, marker.lng])
        
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
    }
  }
}
</script>

<style scoped>
.map-container {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.map {
  border-radius: 0.5rem;
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

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 0.5rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}

:deep(.leaflet-popup-tip) {
  background: white !important;
}
</style>