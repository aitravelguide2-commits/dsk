<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-indigo-100">
          {{ $t('accommodations.title') }}
        </h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto">
          Entdecken Sie unsere modernen und komfortablen Unterkünfte für Monteure und Bauarbeiter in Leipzig
        </p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-8">
      <!-- Advanced Filters - Compact Version -->
      <div class="bg-white rounded-xl shadow-md p-4 mb-6 border border-slate-100">
        <!-- Mobile Filter Toggle -->
        <div class="flex items-center justify-between mb-3 md:hidden">
          <span class="text-sm font-semibold text-slate-700">Filter</span>
          <button 
            @click="filterCollapsed = !filterCollapsed"
            class="text-sky-600 text-xs font-semibold px-2 py-1 rounded-lg border border-sky-200 bg-sky-50"
          >
            {{ filterCollapsed ? 'Anzeigen' : 'Ausblenden' }}
          </button>
        </div>

        <div 
          class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
          :class="{ 'hidden': isMobile && filterCollapsed }"
        >
          <!-- Persons Filter -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">
              {{ $t('accommodations.filter.persons') }}
            </label>
            <select 
              v-model="filters.persons" 
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            >
              <option value="">{{ $t('accommodations.filter.all') }}</option>
              <option value="1">{{ $t('accommodations.filter.person1') }}</option>
              <option value="2">{{ $t('accommodations.filter.person2') }}</option>
              <option value="3">{{ $t('accommodations.filter.person3') }}</option>
              <option value="4">{{ $t('accommodations.filter.person4plus') }}</option>
            </select>
          </div>

          <!-- Location Filter -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">
              {{ $t('accommodations.filter.location') }}
            </label>
            <select 
              v-model="filters.location" 
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            >
              <option value="">{{ $t('accommodations.filter.allLocations') }}</option>
              <option value="Zentrum">Zentrum</option>
              <option value="Nord">Nord</option>
              <option value="Süd">Süd</option>
              <option value="Ost">Ost</option>
              <option value="West">West</option>
            </select>
          </div>

          <!-- Price Range -->
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-slate-600 mb-1">
              {{ $t('accommodations.filter.price') }}
            </label>
            <div class="flex space-x-2">
              <input 
                v-model="filters.minPrice" 
                type="number" 
                placeholder="Min €"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              >
              <input 
                v-model="filters.maxPrice" 
                type="number" 
                placeholder="Max €"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              >
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-2">
            <button 
              @click="resetFilters"
              class="flex-1 border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all"
            >
              Zurücksetzen
            </button>
            <button 
              @click="applyFilters"
              class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-sky-400 hover:to-indigo-400 transition-all shadow-sm hover:shadow-md"
            >
              Anwenden
            </button>
          </div>
        </div>

        <!-- Results Count - Compact -->
        <div class="mt-3 text-xs text-slate-500 text-center md:text-left">
          {{ filteredAccommodations.length }} {{ filteredAccommodations.length === 1 ? $t('accommodations.results.singular') : $t('accommodations.results.plural') }} {{ $t('accommodations.results.found') }}
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
              v-if="accommodation.image"
              :src="accommodation.image" 
              :alt="accommodation.name"
              class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            >
            <div v-else class="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500">
              {{ $t('common.notFound') }}
            </div>
            <div class="absolute top-4 left-4">
              <span class="bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                {{ accommodation.location }}
              </span>
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-white/95 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-full text-sm font-bold shadow-md">
                €{{ accommodation.price }}/{{ $t('accommodations.perNight') }}
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
              <svg class="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span class="text-slate-700 font-medium">{{ $t('accommodations.card.capacityUpTo', { count: accommodation.capacity }) }}</span>
            </div>

            <!-- Features -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="feature in accommodation.features" 
                :key="feature"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200"
              >
                <span class="mr-1">{{ getFeatureIcon(feature) }}</span>
                {{ $t(`accommodations.features.${feature}`) }}
              </span>
            </div>

            <!-- Location Address -->
            <div class="mb-6">
              <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                <svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ accommodation.address }}
              </h4>
              <p class="text-xs text-gray-500 mb-2">{{ accommodation.location }}</p>
              <InteractiveMap
                :center="getAccommodationLocation(accommodation)"
                :zoom="14"
                :height="'150px'"
                :markers="[getAccommodationMarker(accommodation)]"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <button 
                @click="viewDetails(accommodation)"
                class="flex-1 border-2 border-sky-600 text-sky-600 py-3 rounded-full font-semibold hover:bg-sky-50 transition-all duration-200 flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                {{ $t('accommodations.details') }}
              </button>
              <button 
                @click="$router.push({ path: '/buchung', query: { accommodationId: accommodation.id } })"
                class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-3 rounded-full font-semibold hover:from-sky-400 hover:to-indigo-400 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
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
          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('accommodations.noResults.title') }}</h3>
          <p class="text-gray-600 mb-4">{{ $t('accommodations.noResults.description') }}</p>
          <button 
            @click="resetFilters"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {{ $t('accommodations.filter.reset') }}
          </button>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        <div class="relative z-10">
          <h2 class="text-2xl font-bold mb-4">{{ $t('accommodations.cta.title') }}</h2>
          <p class="text-slate-300 mb-6">{{ $t('accommodations.cta.description') }}</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              to="/kontakt"
              class="bg-white text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition-all duration-200 inline-flex items-center justify-center shadow-md"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              {{ $t('accommodations.cta.contactButton') }}
            </router-link>
            <a 
              href="tel:+4915171421923"
              class="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-all duration-200 inline-flex items-center justify-center"
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
  </div>
</template>

<script>
import { useSEO, seoData } from '../composables/useSEO.js'
import { useI18n } from 'vue-i18n'
import InteractiveMap from './InteractiveMap.vue'
import { accommodationService } from '../services/api.js'

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
    this.isMobile = window.innerWidth < 768
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('scroll', this.handleScroll)
    this.loadAccommodations()
  },
  watch: {
    locale() {
      this.updateSEO()
    }
  },
  data() {
    return {
      isMobile: false,
      filterCollapsed: false,
      filters: {
        persons: '',
        location: '',
        minPrice: '',
        maxPrice: ''
      },
      accommodations: []
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
    handleResize() {
      this.isMobile = window.innerWidth < 768
    },
    handleScroll() {
      if (this.isMobile) {
        this.filterCollapsed = window.scrollY > 80
      }
    },
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
    async loadAccommodations() {
      try {
        const res = await accommodationService.getAll({ isActive: true })
        
        // Backend already provides correctly mapped data via /catalog/accommodations
        // Fields: id, name, description, price, capacity, location, address, features, image, images
        this.accommodations = res.data || []
        
        console.log('Loaded accommodations:', this.accommodations.length, this.accommodations)
      } catch (err) {
        console.error('Fehler beim Laden der Unterkünfte:', err)
        this.accommodations = []
      }
    },
    getFeatureIcon(feature) {
      const icons = {
        wifi: '📶',
        kitchen: '🍳',
        parking: '🚗',
        bathroom: '🚿',
        tv: '📺',
        laundry: '🧺',
        balcony: '🛋️'
      }
      return icons[feature] || '✓'
    },
    getAccommodationLocation(accommodation) {
      // Prefer explicit coordinates when available; otherwise fallback by district
      if (accommodation.coordinates && Array.isArray(accommodation.coordinates) && accommodation.coordinates.length === 2) {
        return accommodation.coordinates
      }
      const locations = {
        'Zentrum': [51.3397, 12.3731],
        'West': [51.3350, 12.3200],
        'Nord': [51.3600, 12.3731],
        'Süd': [51.3200, 12.3731],
        'Ost': [51.3397, 12.4100],
        'Plagwitz': [51.3315, 12.3262],
        'Connewitz': [51.3037, 12.3737],
        'Gohlis': [51.3620, 12.3603],
        'Reudnitz': [51.3376, 12.4047]
      }
      return locations[accommodation.location] || [51.3397, 12.3731]
    },
    getAccommodationMarker(accommodation) {
      const location = this.getAccommodationLocation(accommodation)
      return {
        lat: location[0],
        lng: location[1],
        popup: `<strong>${accommodation.name}</strong><br>${accommodation.address}<br>€${accommodation.price}/Nacht`,
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
