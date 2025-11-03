<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          {{ $t('accommodations.title') }}
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto">
          Entdecken Sie unsere modernen und komfortablen Unterkünfte für Monteure und Bauarbeiter in Leipzig
        </p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-12">
      <!-- Advanced Filters -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 sticky top-24 z-40">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <!-- Persons Filter -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('accommodations.filter.persons') }}
            </label>
            <select 
              v-model="filters.persons" 
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Alle</option>
              <option value="1">1 Person</option>
              <option value="2">2 Personen</option>
              <option value="3">3 Personen</option>
              <option value="4">4+ Personen</option>
            </select>
          </div>

          <!-- Location Filter -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Standort
            </label>
            <select 
              v-model="filters.location" 
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Alle Standorte</option>
              <option value="Zentrum">Zentrum</option>
              <option value="Nord">Nord</option>
              <option value="Süd">Süd</option>
              <option value="Ost">Ost</option>
              <option value="West">West</option>
            </select>
          </div>

          <!-- Price Range -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('accommodations.filter.price') }}
            </label>
            <div class="flex space-x-2">
              <input 
                v-model="filters.minPrice" 
                type="number" 
                placeholder="Min €"
                class="w-full border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
              <input 
                v-model="filters.maxPrice" 
                type="number" 
                placeholder="Max €"
                class="w-full border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-2">
            <button 
              @click="resetFilters"
              class="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              {{ $t('accommodations.filter.reset') }}
            </button>
            <button 
              @click="applyFilters"
              class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {{ $t('accommodations.filter.apply') }}
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mt-4 text-sm text-gray-600">
          {{ filteredAccommodations.length }} {{ filteredAccommodations.length === 1 ? 'Unterkunft' : 'Unterkünfte' }} gefunden
        </div>
      </div>

      <!-- Accommodations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="accommodation in filteredAccommodations" 
          :key="accommodation.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:scale-105"
        >
          <!-- Image -->
          <div class="relative overflow-hidden">
            <img 
              :src="accommodation.image" 
              :alt="accommodation.name"
              class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            >
            <div class="absolute top-4 left-4">
              <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {{ accommodation.location }}
              </span>
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                €{{ accommodation.price }}/Nacht
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {{ accommodation.name }}
            </h3>
            <p class="text-gray-600 mb-4 line-clamp-2">
              {{ accommodation.description }}
            </p>

            <!-- Capacity -->
            <div class="flex items-center mb-4">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span class="text-gray-700 font-medium">Bis zu {{ accommodation.capacity }} Personen</span>
            </div>

            <!-- Features -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="feature in accommodation.features" 
                :key="feature"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                <span class="mr-1">{{ getFeatureIcon(feature) }}</span>
                {{ $t(`accommodations.features.${feature}`) }}
              </span>
            </div>

            <!-- Location Address -->
            <div class="mb-6">
              <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ accommodation.location }}
              </h4>
              <InteractiveMap
                :center="getAccommodationLocation(accommodation)"
                :zoom="14"
                :height="150"
                :markers="[getAccommodationMarker(accommodation)]"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <button 
                @click="viewDetails(accommodation)"
                class="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                {{ $t('accommodations.details') }}
              </button>
              <button 
                @click="$router.push(`/buchung/${accommodation.id}`)"
                class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ $t('accommodations.book') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredAccommodations.length === 0" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Keine Unterkünfte gefunden</h3>
          <p class="text-gray-600 mb-4">Versuchen Sie andere Filtereinstellungen oder kontaktieren Sie uns direkt.</p>
          <button 
            @click="resetFilters"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Filter zurücksetzen
          </button>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
        <h2 class="text-2xl font-bold mb-4">Haben Sie Fragen zu unseren Unterkünften?</h2>
        <p class="text-blue-100 mb-6">Unser Team berät Sie gerne persönlich und findet die perfekte Lösung für Ihr Team.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/kontakt"
            class="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            Kontakt aufnehmen
          </router-link>
          <a 
            href="tel:+4915171421923"
            class="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 inline-flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            +49 151 71421923
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSEO, seoData } from '../composables/useSEO.js'
import { useI18n } from 'vue-i18n'
import InteractiveMap from './InteractiveMap.vue'

export default {
  name: 'Accommodations',
  components: {
    InteractiveMap
  },
  setup() {
    const { setPageSEO } = useSEO()
    const { locale } = useI18n()
    
    return {
      setPageSEO,
      locale
    }
  },
  mounted() {
    this.updateSEO()
  },
  watch: {
    locale() {
      this.updateSEO()
    }
  },
  data() {
    return {
      filters: {
        persons: '',
        location: '',
        minPrice: '',
        maxPrice: ''
      },
      accommodations: [
        {
          id: 1,
          name: 'Moderne Monteurwohnung Zentrum',
          description: 'Helle und moderne 2-Zimmer-Wohnung im Herzen von Leipzig mit voll ausgestatteter Küche und Arbeitsbereich',
          price: 89,
          capacity: 4,
          location: 'Zentrum',
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'tv'],
          image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 2,
          name: 'Komfort-Appartement West',
          description: 'Geräumiges Appartement mit separatem Arbeitsbereich und Waschmaschine',
          price: 75,
          capacity: 3,
          location: 'West',
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'laundry'],
          image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 3,
          name: 'Wohnheim für Bauteams',
          description: 'Praktische Lösung für größere Montageteams mit mehreren Schlafzimmern',
          price: 65,
          capacity: 6,
          location: 'Nord',
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'laundry', 'tv'],
          image: 'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 4,
          name: 'Business Apartment Süd',
          description: 'Modernes Apartment mit Bürobereich und schnellem Internet',
          price: 95,
          capacity: 2,
          location: 'Süd',
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'tv'],
          image: 'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 5,
          name: 'Teamunterkunft Ost',
          description: 'Großzügige Unterkunft für Montageteams mit Gemeinschaftsküche',
          price: 55,
          capacity: 8,
          location: 'Ost',
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'laundry'],
          image: 'https://images.pexels.com/photos/271616/pexels-photo-271616.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 6,
          name: 'Premium Suite Zentrum',
          description: 'Luxuriöse Suite mit separatem Wohn- und Schlafbereich',
          price: 120,
          capacity: 2,
          location: 'Zentrum',
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'tv', 'laundry'],
          image: 'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 7,
          name: 'Familienwohnung Plagwitz',
          description: 'Geräumige 3-Zimmer-Wohnung in beliebtem Stadtteil mit Balkon und Waschmaschine',
          price: 85,
          capacity: 5,
          location: 'Plagwitz',
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'tv', 'laundry', 'balcony'],
          image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 8,
          name: 'Studio Apartment Connewitz',
          description: 'Modernes Studio-Apartment für Einzelpersonen mit kompakter Ausstattung',
          price: 45,
          capacity: 1,
          location: 'Connewitz',
          features: ['wifi', 'kitchen', 'bathroom', 'tv'],
          image: 'https://images.pexels.com/photos/271647/pexels-photo-271647.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 9,
          name: 'Monteur-WG Gohlis',
          description: 'Wohngemeinschaft für 4 Personen mit Einzelzimmern und Gemeinschaftsküche',
          price: 60,
          capacity: 4,
          location: 'Gohlis',
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'laundry'],
          image: 'https://images.pexels.com/photos/271650/pexels-photo-271650.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 10,
          name: 'Executive Suite Reudnitz',
          description: 'Hochwertige Suite mit separatem Arbeitsbereich und Premium-Ausstattung',
          price: 110,
          capacity: 2,
          location: 'Reudnitz',
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'tv', 'laundry', 'balcony'],
          image: 'https://images.pexels.com/photos/271652/pexels-photo-271652.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ]
    }
  },
  computed: {
    filteredAccommodations() {
      return this.accommodations.filter(acc => {
        const personsMatch = !this.filters.persons || acc.capacity >= parseInt(this.filters.persons)
        const locationMatch = !this.filters.location || acc.location === this.filters.location
        const minPriceMatch = !this.filters.minPrice || acc.price >= parseInt(this.filters.minPrice)
        const maxPriceMatch = !this.filters.maxPrice || acc.price <= parseInt(this.filters.maxPrice)
        return personsMatch && locationMatch && minPriceMatch && maxPriceMatch
      })
    }
  },
  methods: {
    updateSEO() {
      const currentSeoData = seoData.accommodations[this.locale] || seoData.accommodations.de
      this.setPageSEO({
        ...currentSeoData,
        canonical: `${window.location.origin}/unterkuenfte`,
        ogUrl: `${window.location.origin}/unterkuenfte`,
        ogImage: `${window.location.origin}/images/accommodations-overview.jpg`
      })
    },
    applyFilters() {
      // Filters are applied automatically through computed property
    },
    resetFilters() {
      this.filters.persons = ''
      this.filters.location = ''
      this.filters.minPrice = ''
      this.filters.maxPrice = ''
    },
    viewDetails(accommodation) {
      this.$router.push(`/unterkunft/${accommodation.id}`)
    },
    getFeatureIcon(feature) {
      const icons = {
        wifi: '📶',
        kitchen: '🍳',
        parking: '🚗',
        bathroom: '🚿',
        tv: '📺',
        laundry: '🧺'
      }
      return icons[feature] || '✓'
    },
    getAccommodationLocation(accommodation) {
      // Define locations for each accommodation based on their location property
      const locations = {
        'Zentrum': [51.3397, 12.3731], // Leipzig city center
        'West': [51.3350, 12.3200],    // Leipzig west
        'Nord': [51.3600, 12.3731],    // Leipzig north
        'Süd': [51.3200, 12.3731],     // Leipzig south
        'Ost': [51.3397, 12.4100]      // Leipzig east
      }
      return locations[accommodation.location] || [51.3397, 12.3731] // Default to center
    },
    getAccommodationMarker(accommodation) {
      const location = this.getAccommodationLocation(accommodation)
      return {
        lat: location[0],
        lng: location[1],
        popup: `<strong>${accommodation.name}</strong><br>€${accommodation.price}/Nacht<br>${accommodation.location}`,
        tooltip: accommodation.name
      }
    }
  }
}
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Glassmorphism backdrop support */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-md {
    backdrop-filter: blur(12px);
  }
}

/* Smooth animations */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Sticky filter bar enhancement */
.sticky {
  backdrop-filter: blur(12px);
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Enhanced focus states */
input:focus,
select:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
