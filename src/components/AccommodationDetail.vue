<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!accommodation" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('common.notFound') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('accommodations.notFoundMessage') }}</p>
        <router-link to="/unterkuenfte" class="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          {{ $t('accommodations.backToList') }}
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center mb-4">
          <button @click="$router.go(-1)" class="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">{{ accommodation.name }}</h1>
        </div>
        
        <div class="flex items-center space-x-4 text-sm text-gray-600">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
            {{ accommodation.location }}
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            {{ accommodation.capacity }} {{ $t('accommodations.persons') }}
          </div>
        </div>
      </div>

      <!-- Image Gallery -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12 rounded-2xl overflow-hidden">
        <div class="lg:row-span-2">
          <img 
            :src="accommodation.image" 
            :alt="accommodation.name"
            class="w-full h-96 lg:h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            @click="openImageModal"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <img 
            v-for="(image, index) in additionalImages" 
            :key="index"
            :src="image" 
            :alt="`${accommodation.name} ${index + 1}`"
            class="w-full h-44 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            @click="openImageModal"
          />
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-3 gap-12">
        <!-- Left Column - Details -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Host Info -->
          <div class="border-b border-gray-200 pb-8">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-2">
                  Monteurunterkunft in {{ accommodation.location }}
                </h2>
                <p class="text-gray-600">
                  Gastgeber: DSK-UG Monteurunterkünfte
                </p>
              </div>
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-lg">D</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="border-b border-gray-200 pb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Über diese Unterkunft</h3>
            <p class="text-gray-700 leading-relaxed">{{ accommodation.description }}</p>
          </div>

          <!-- Features -->
          <div class="border-b border-gray-200 pb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Was diese Unterkunft bietet</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="feature in accommodation.features" 
                :key="feature"
                class="flex items-center p-4 bg-gray-50 rounded-xl"
              >
                <span class="text-2xl mr-3" v-html="getFeatureIcon(feature)"></span>
                <span class="text-gray-800 font-medium">{{ $t(`accommodations.features.${feature}`) }}</span>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="border-b border-gray-200 pb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Wo Sie übernachten werden</h3>
            <div class="bg-gray-50 rounded-2xl p-6">
              <div class="mb-4">
                <h4 class="font-semibold text-gray-800 mb-2">{{ accommodation.location }}</h4>
                <p class="text-gray-600">Zentrale Lage in Leipzig mit guter Verkehrsanbindung</p>
              </div>
              <InteractiveMap
                :center="getAccommodationLocation(accommodation)"
                :zoom="15"
                :height="300"
                :markers="[getAccommodationMarker(accommodation)]"
              />
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="border-b border-gray-200 pb-8">
            <div class="flex items-center mb-6">
              <svg class="w-6 h-6 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <h3 class="text-xl font-semibold text-gray-900">4.8 · 24 Bewertungen</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center mb-3">
                  <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white font-semibold text-sm">MK</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">Michael K.</p>
                    <p class="text-sm text-gray-600">März 2024</p>
                  </div>
                </div>
                <p class="text-gray-700">"Sehr saubere und gut ausgestattete Unterkunft. Perfekt für Monteure!"</p>
              </div>
              
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center mb-3">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white font-semibold text-sm">AS</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">Andreas S.</p>
                    <p class="text-sm text-gray-600">Februar 2024</p>
                  </div>
                </div>
                <p class="text-gray-700">"Zentrale Lage, gute Ausstattung. Kann ich nur empfehlen!"</p>
              </div>
            </div>
          </div>

          <!-- House Rules -->
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Hausregeln</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-gray-700">Check-in: 15:00 - 22:00</span>
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-gray-700">Check-out: bis 11:00</span>
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
                </svg>
                <span class="text-gray-700">Rauchen nicht gestattet</span>
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
                </svg>
                <span class="text-gray-700">Keine Haustiere</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Booking Card -->
        <div class="lg:col-span-1">
          <div class="sticky top-8">
            <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <span class="text-3xl font-bold text-gray-900">€{{ accommodation.price }}</span>
                  <span class="text-gray-600 ml-1">pro Nacht</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="text-sm font-semibold">4.8</span>
                </div>
              </div>

              <!-- Date Selection -->
              <div class="border border-gray-300 rounded-xl mb-4">
                <div class="grid grid-cols-2">
                  <div class="p-3 border-r border-gray-300">
                    <label class="block text-xs font-semibold text-gray-700 mb-1">CHECK-IN</label>
                    <input 
                      type="date" 
                      v-model="checkInDate"
                      :min="minDate"
                      class="w-full text-sm border-none focus:outline-none"
                    />
                  </div>
                  <div class="p-3">
                    <label class="block text-xs font-semibold text-gray-700 mb-1">CHECK-OUT</label>
                    <input 
                      type="date" 
                      v-model="checkOutDate"
                      :min="minCheckOutDate"
                      class="w-full text-sm border-none focus:outline-none"
                    />
                  </div>
                </div>
                <div class="p-3 border-t border-gray-300">
                  <label class="block text-xs font-semibold text-gray-700 mb-1">GÄSTE</label>
                  <select v-model="guests" class="w-full text-sm border-none focus:outline-none">
                    <option v-for="n in accommodation.capacity" :key="n" :value="n">
                      {{ n }} {{ n === 1 ? 'Gast' : 'Gäste' }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Book Button -->
              <button 
                @click="bookNow"
                :disabled="!checkInDate || !checkOutDate"
                class="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                Reservieren
              </button>

              <p class="text-center text-sm text-gray-600 mb-4">
                Sie werden noch nicht belastet
              </p>

              <!-- Price Breakdown -->
              <div v-if="checkInDate && checkOutDate" class="space-y-3 pt-4 border-t border-gray-200">
                <div class="flex justify-between">
                  <span class="text-gray-700">€{{ accommodation.price }} x {{ nights }} Nächte</span>
                  <span class="text-gray-900">€{{ totalPrice }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-700">Reinigungsgebühr</span>
                  <span class="text-gray-900">€25</span>
                </div>
                <div class="flex justify-between pt-3 border-t border-gray-200 font-semibold">
                  <span class="text-gray-900">Gesamt</span>
                  <span class="text-gray-900">€{{ totalPrice + 25 }}</span>
                </div>
              </div>
            </div>

            <!-- Contact Card -->
            <div class="mt-6 bg-gray-50 rounded-2xl p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Fragen?</h4>
                  <p class="text-sm text-gray-600">Kontaktieren Sie uns direkt</p>
                </div>
              </div>
              <a 
                href="tel:+4915171421923"
                class="block w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center"
              >
                +49 151 71421923
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InteractiveMap from './InteractiveMap.vue'

export default {
  name: 'AccommodationDetail',
  components: {
    InteractiveMap
  },
  data() {
    return {
      accommodation: null,
      loading: true,
      checkInDate: '',
      checkOutDate: '',
      guests: 1,
      additionalImages: [
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/271616/pexels-photo-271616.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
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
    minDate() {
      return new Date().toISOString().split('T')[0]
    },
    minCheckOutDate() {
      if (!this.checkInDate) return this.minDate
      const checkIn = new Date(this.checkInDate)
      checkIn.setDate(checkIn.getDate() + 1)
      return checkIn.toISOString().split('T')[0]
    },
    nights() {
      if (!this.checkInDate || !this.checkOutDate) return 0
      const checkIn = new Date(this.checkInDate)
      const checkOut = new Date(this.checkOutDate)
      const diffTime = Math.abs(checkOut - checkIn)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    totalPrice() {
      return this.nights * (this.accommodation?.price || 0)
    }
  },
  mounted() {
    this.loadAccommodation()
  },
  watch: {
    '$route'() {
      this.loadAccommodation()
    }
  },
  methods: {
    loadAccommodation() {
      this.loading = true
      const id = parseInt(this.$route.params.id)
      
      // Simulate API call
      setTimeout(() => {
        this.accommodation = this.accommodations.find(acc => acc.id === id)
        this.loading = false
        
        if (this.accommodation) {
          this.guests = 1
          this.updateSEO()
        }
      }, 500)
    },
    
    updateSEO() {
      if (this.accommodation) {
        document.title = `${this.accommodation.name} - DSK UG Monteurunterkünfte Leipzig`
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', this.accommodation.description)
        }
      }
    },
    
    getFeatureIcon(feature) {
      const icons = {
        wifi: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>',
        kitchen: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2.01L6 2c-1.1 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.1 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM18 20H6v-9.02h12V20zm0-11H6V4h12v5zM8 5h2v3H8zm3 0h2v3h-2z"/></svg>',
        parking: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>',
        tv: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5l-1 1v2h8v-2l-1-1h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z"/></svg>',
        washing_machine: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2.01L6 2c-1.1 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.1 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM18 20H6V4h12v16zM12 6c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>',
        balcony: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 10v2H8v-2h2zm6 2v-2h2v2h-2zm-3 0V8h-2v4h2zm-1-9L2 8v13h20V8l-10-5zM4.5 19v-7.5h15V19h-15z"/></svg>'
      }
      return icons[feature] || '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
    },
    
    getAccommodationLocation(accommodation) {
      const locations = {
        'Leipzig Zentrum': [51.3397, 12.3731],
        'Leipzig Süd': [51.3200, 12.3800],
        'Leipzig Nord': [51.3600, 12.3700],
        'Leipzig Ost': [51.3400, 12.4000],
        'Leipzig West': [51.3400, 12.3400]
      }
      return locations[accommodation.location] || [51.3397, 12.3731]
    },
    
    getAccommodationMarker(accommodation) {
      const [lat, lng] = this.getAccommodationLocation(accommodation)
      return {
        position: [lat, lng],
        popup: `<strong>${accommodation.name}</strong><br>${accommodation.location}<br>${accommodation.price}€ ${this.$t('accommodations.perNight')}`,
        tooltip: accommodation.name
      }
    },
    
    openImageModal() {
      // Implement image modal functionality
      console.log('Open image modal')
    },
    
    bookNow() {
      if (!this.checkInDate || !this.checkOutDate) {
        alert('Bitte wählen Sie Check-in und Check-out Daten aus.')
        return
      }
      
      // Navigate to booking page with pre-filled data
      this.$router.push({
        path: `/buchung/${this.accommodation.id}`,
        query: {
          checkIn: this.checkInDate,
          checkOut: this.checkOutDate,
          guests: this.guests
        }
      })
    }
  }
}
</script>

<style scoped>
/* Custom styles for enhanced Airbnb-like experience */
.sticky {
  position: sticky;
}

/* Smooth transitions for interactive elements */
.transition-transform {
  transition: transform 0.3s ease;
}

.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease;
}

.transition-all {
  transition: all 0.2s ease;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:from-pink-600:hover {
  background-image: linear-gradient(to right, #db2777, #dc2626);
}

.hover\:to-red-600:hover {
  background-image: linear-gradient(to right, #db2777, #dc2626);
}

/* Gradient backgrounds */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-blue-500 {
  --tw-gradient-from: #3b82f6;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 130, 246, 0));
}

.to-indigo-500 {
  --tw-gradient-to: #6366f1;
}

.from-pink-500 {
  --tw-gradient-from: #ec4899;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(236, 72, 153, 0));
}

.to-red-500 {
  --tw-gradient-to: #ef4444;
}

/* Animation for loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Focus styles for accessibility */
input:focus,
select:focus,
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .lg\:col-span-2 {
    grid-column: span 1 / span 1;
  }
  
  .lg\:row-span-2 {
    grid-row: span 1 / span 1;
  }
  
  .lg\:h-full {
    height: 24rem;
  }
}

/* Enhanced shadow for booking card */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Disabled state styling */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
</style>