<template>
  <div class="min-h-screen py-8 bg-gray-50">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        {{ pageContent.contact_title || $t('contact.title') }}
      </h1>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Contact Form -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <form @submit.prevent="submitContact" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('contact.form.name') }}
              </label>
              <input 
                type="text" 
                v-model="contactData.name"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('contact.form.email') }}
              </label>
              <input 
                type="email" 
                v-model="contactData.email"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('contact.form.phone') }}
              </label>
              <input 
                type="tel" 
                v-model="contactData.phone"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+49 151 71421923"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('contact.form.subject') }}
              </label>
              <select 
                v-model="contactData.subject"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Bitte wählen...</option>
                <option value="Buchungsanfrage">Buchungsanfrage</option>
                <option value="Allgemeine Information">Allgemeine Information</option>
                <option value="Problem mit Buchung">Problem mit Buchung</option>
                <option value="Sonstiges">Sonstiges</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('contact.form.message') }}
              </label>
              <textarea 
                v-model="contactData.message"
                rows="6"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <!-- Success Message -->
            <div v-if="emailService.success.value" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="emailService.error.value" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                {{ emailService.error.value }}
              </div>
            </div>

            <button 
              type="submit"
              :disabled="emailService.isLoading.value"
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="emailService.isLoading.value" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wird gesendet...
              </span>
              <span v-else>{{ $t('contact.form.submit') }}</span>
            </button>
          </form>
        </div>

        <!-- Contact Information -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
              {{ $t('contact.info.title') }}
            </h3>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800">Adresse</h4>
                  <p class="text-gray-600">{{ pageContent.contact_address || $t('contact.info.address') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800">Telefon</h4>
                  <p class="text-gray-600">{{ pageContent.contact_phone || $t('contact.info.phone') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800">E-Mail</h4>
                  <p class="text-gray-600">
                    <a :href="'mailto:' + (pageContent.contact_email || 'info@dsk-ug.de')" class="text-blue-600 hover:underline">{{ pageContent.contact_email || 'info@dsk-ug.de' }}</a>
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800">Öffnungszeiten</h4>
                  <p class="text-gray-600">{{ $t('contact.info.hours') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Map -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ $t('contact.location') }}</h3>
            <InteractiveMap 
              :center="[51.3397, 12.3731]"
              :zoom="12"
              height="300px"
              :markers="mapMarkers"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSEO, seoData } from '../composables/useSEO.js'
import { useEmailService } from '../composables/useEmailService.js'
import { useI18n } from 'vue-i18n'
import InteractiveMap from './InteractiveMap.vue'
import { contentService } from '../services/api.js'

export default {
  name: 'Contact',
  components: {
    InteractiveMap
  },
  setup() {
    const { setPageSEO } = useSEO()
    const { locale } = useI18n()
    const emailService = useEmailService()
    
    return {
      setPageSEO,
      locale,
      emailService
    }
  },
  mounted() {
    this.updateSEO()
    this.loadContent()
  },
  watch: {
    locale() {
      this.updateSEO()
    }
  },
  data() {
    return {
      pageContent: {},
      mapMarkers: [
        {
          lat: 51.3397,
          lng: 12.3731,
          popup: `
            <div class="text-center">
              <h4 class="font-semibold text-gray-800">DSK-UG Monteurunterkünfte</h4>
              <p class="text-sm text-gray-600">Leipzig, Deutschland</p>
              <p class="text-sm text-blue-600 mt-1">+49 151 71421923</p>
            </div>
          `,
          tooltip: 'DSK-UG Monteurunterkünfte Leipzig'
        }
      ],
      contactData: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
    }
  },
  methods: {
    async loadContent() {
      try {
        const data = await contentService.getPageContent('contact')
        const entry = Array.isArray(data) ? data.find(d => d.section === 'main') : data
        if (entry && entry.content) {
          this.pageContent = entry.content
        }
      } catch (e) {
        console.error('Failed to load page content', e)
      }
    },
    updateSEO() {
      const currentSeoData = seoData.contact[this.locale] || seoData.contact.de
      this.setPageSEO({
        ...currentSeoData,
        canonical: `${window.location.origin}/kontakt`,
        ogUrl: `${window.location.origin}/kontakt`,
        ogImage: `${window.location.origin}/images/contact-hero.jpg`
      })
    },
    async submitContact() {
      // Reset previous states
      this.emailService.resetState()
      
      try {
        const result = await this.emailService.sendContactEmail(this.contactData)
        
        if (result.success) {
          // Reset form on success
          this.contactData = {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          }
          
          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            this.emailService.resetState()
          }, 5000)
        }
      } catch (error) {
        console.error('Contact form submission error:', error)
      }
    }
  }
}
</script>
