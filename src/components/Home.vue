<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 sm:py-16 md:py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in-up">
          {{ $t('hero.title') }}
        </h1>
        <p class="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up stagger-1 px-4">
          {{ $t('hero.subtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up stagger-2 px-4">
          <button 
            @click="$router.push('/buchung')"
            class="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-50 transition-colors shadow-lg btn-ripple hover-lift w-full sm:w-auto"
          >
            {{ $t('hero.cta1') }}
          </button>
          <button 
            @click="$router.push('/unterkuenfte')"
            class="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-colors btn-ripple hover-scale w-full sm:w-auto"
          >
            {{ $t('hero.cta2') }}
          </button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-12 sm:py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 fade-in-on-scroll">
            {{ $t('about.title') }}
          </h2>
          <p class="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 leading-relaxed fade-in-on-scroll px-4">
            {{ $t('about.description') }}
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div v-for="(feature, index) in features" :key="feature.id" class="text-center fade-in-on-scroll card-interactive" :class="`stagger-${index + 1}`">
              <div class="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 hover-scale">
                <span class="text-blue-600 text-xl sm:text-2xl">{{ feature.icon }}</span>
              </div>
              <h3 class="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{{ $t(`about.features.${feature.key}`) }}</h3>
              <p class="text-gray-600 text-xs sm:text-sm px-2">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Accommodations -->
    <section class="py-12 sm:py-16 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
          {{ $t('accommodations.title') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div 
            v-for="(accommodation, index) in featuredAccommodations" 
            :key="accommodation.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow fade-in-on-scroll hover-lift card-interactive"
            :class="`stagger-${index + 1}`"
          >
            <div class="h-40 sm:h-48 bg-gray-200 relative">
              <img 
                :src="accommodation.image" 
                :alt="accommodation.name"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-3 sm:top-4 right-3 sm:right-4 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                €{{ accommodation.price }}/{{ $t('booking.summary.perNight') }}
              </div>
            </div>
            
            <div class="p-4 sm:p-6">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{{ accommodation.name }}</h3>
              <p class="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{{ accommodation.description }}</p>
              
              <div class="flex items-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                <span class="flex items-center mr-4">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                  {{ accommodation.capacity }} {{ $t('accommodations.filter.persons') }}
                </span>
              </div>
              
              <div class="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                <span 
                  v-for="feature in accommodation.features" 
                  :key="feature"
                  class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {{ $t(`accommodations.features.${feature}`) }}
                </span>
              </div>
              
              <button 
                @click="$router.push(`/unterkunft/${accommodation.id}`)"
                class="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors btn-ripple hover-glow text-sm sm:text-base"
              >
                {{ $t('accommodations.book') }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-8 sm:mt-12">
          <button 
            @click="$router.push('/unterkuenfte')"
            class="bg-white border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm sm:text-base"
          >
            {{ $t('hero.cta2') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Trust Elements -->
    <TrustElements />

    <!-- Map Preview -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          Standorte in Leipzig
        </h2>
        <InteractiveMap 
          :center="[51.3397, 12.3731]"
          :zoom="12"
          height="320px"
          :markers="mapMarkers"
        />
      </div>
    </section>
  </div>
</template>

<script>
import TrustElements from './TrustElements.vue'
import InteractiveMap from './InteractiveMap.vue'

import { useSEO, seoData } from '../composables/useSEO.js'
import { useStructuredData, structuredDataTemplates } from '../composables/useStructuredData.js'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Home',
  components: {
    TrustElements,
    InteractiveMap
  },
  setup() {
    const { setPageSEO } = useSEO()
    const { addStructuredData } = useStructuredData()
    const { locale } = useI18n()
    
    // Map markers for accommodations
    const mapMarkers = [
      {
        lat: 51.3397,
        lng: 12.3731,
        popup: '<b>DSK UG Monteurunterkünfte</b><br>Zentrale Lage in Leipzig',
        tooltip: 'Hauptstandort'
      },
      {
        lat: 51.3450,
        lng: 12.3800,
        popup: '<b>Moderne Apartments</b><br>Nähe Stadtzentrum',
        tooltip: 'Apartment-Komplex Nord'
      },
      {
        lat: 51.3350,
        lng: 12.3650,
        popup: '<b>Komfortable Unterkünfte</b><br>Ruhige Wohnlage',
        tooltip: 'Apartment-Komplex Süd'
      }
    ]
    
    return {
      setPageSEO,
      addStructuredData,
      locale,
      mapMarkers
    }
  },
  mounted() {
    this.initScrollAnimations()
    this.updateSEO()
  },
  watch: {
    locale() {
      this.updateSEO()
    }
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    updateSEO() {
      const currentSeoData = seoData.home[this.locale] || seoData.home.de
      this.setPageSEO({
        ...currentSeoData,
        canonical: `${window.location.origin}/`,
        ogUrl: `${window.location.origin}/`,
        ogImage: `${window.location.origin}/images/hero-image.jpg`
      })
      
      // Add structured data for homepage
      const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
          structuredDataTemplates.organization,
          structuredDataTemplates.website,
          structuredDataTemplates.lodgingBusiness,
          structuredDataTemplates.localBusiness
        ]
      }
      this.addStructuredData(structuredData)
    },
    initScrollAnimations() {
      // Intersection Observer for scroll animations
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      })

      // Observe all elements with fade-in-on-scroll class
      this.$nextTick(() => {
        const elements = this.$el.querySelectorAll('.fade-in-on-scroll')
        elements.forEach(el => {
          this.observer.observe(el)
        })
      })
    }
  },
  data() {
    return {
      features: [
        { 
          id: 1, 
          key: 'feature1',
          icon: '📍',
          description: 'Schnell erreichbar von allen Baustellen' 
        },
        { 
          id: 2, 
          key: 'feature2',
          icon: '🏠',
          description: 'Voll ausgestattet für Ihren Komfort' 
        },
        { 
          id: 3, 
          key: 'feature3',
          icon: '📅',
          description: 'Anpassbar an Ihre Projektzeiten' 
        },
        { 
          id: 4, 
          key: 'feature4',
          description: 'Immer für Sie da',
          icon: '🛎️'
        }
      ],
      featuredAccommodations: [
        {
          id: 1,
          name: 'Moderne Monteurwohnung Zentrum',
          description: 'Helle und moderne 2-Zimmer-Wohnung im Herzen von Leipzig',
          price: 89,
          capacity: 4,
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'tv'],
          image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 2,
          name: 'Komfort-Appartement West',
          description: 'Geräumiges Appartement mit separatem Arbeitsbereich',
          price: 75,
          capacity: 3,
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'laundry'],
          image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 3,
          name: 'Wohnheim für Bauteams',
          description: 'Praktische Lösung für größere Montageteams',
          price: 65,
          capacity: 6,
          features: ['wifi', 'kitchen', 'parking', 'bathroom', 'laundry', 'tv'],
          image: 'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ]
    }
  }
}
</script>
