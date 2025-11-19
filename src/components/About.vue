<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          {{ pageContent.about_title || $t('about.title') }}
        </h1>
        <p class="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {{ pageContent.about_description || $t('about.description') }}
        </p>
      </div>

      <!-- Experience Timeline -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">{{ $t('about.experience.title') }}</h2>
        
        <div class="space-y-8">
          <div v-for="item in experienceItems" :key="item.year" class="flex">
            <div class="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
              {{ item.year }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ item.title }}</h3>
              <p class="text-gray-600">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Values -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div v-for="value in valueItems" :key="value.title" class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-blue-600 text-2xl">{{ value.icon }}</span>
          </div>
          <h3 class="font-semibold text-gray-800 mb-2">{{ value.title }}</h3>
          <p class="text-gray-600 text-sm">{{ value.description }}</p>
        </div>
      </div>

      <!-- Why Choose Us -->
      <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <h2 class="text-2xl font-bold mb-8 text-center">{{ $t('about.reasons.title') }}</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="reason in reasonItems" :key="reason.title" class="flex items-start">
            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-2">{{ reason.title }}</h3>
              <p class="text-blue-100 text-sm">{{ reason.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { contentService } from '../services/api.js'

export default {
  name: 'About',
  data() {
    return {
      pageContent: {},
      icons: {
        partnership: '🤝',
        quality: '⭐',
        speed: '⚡',
        expertise: '🛠️'
      }
    }
  },
  mounted() {
    this.loadContent()
  },
  methods: {
    async loadContent() {
      try {
        const data = await contentService.getPageContent('about')
        const entry = Array.isArray(data) ? data.find(d => d.section === 'main') : data
        if (entry && entry.content) {
          this.pageContent = entry.content
        }
      } catch (e) {
        console.error('Failed to load page content', e)
      }
    }
  },
  computed: {
    experienceItems() {
      return [
        { year: '2014', title: this.$t('about.experience.y2014.title'), description: this.$t('about.experience.y2014.description') },
        { year: '2016', title: this.$t('about.experience.y2016.title'), description: this.$t('about.experience.y2016.description') },
        { year: '2018', title: this.$t('about.experience.y2018.title'), description: this.$t('about.experience.y2018.description') },
        { year: '2020', title: this.$t('about.experience.y2020.title'), description: this.$t('about.experience.y2020.description') },
        { year: '2023', title: this.$t('about.experience.y2023.title'), description: this.$t('about.experience.y2023.description') }
      ]
    },
    valueItems() {
      return [
        { icon: this.icons.partnership, title: this.$t('about.values.partnership.title'), description: this.$t('about.values.partnership.description') },
        { icon: this.icons.quality, title: this.$t('about.values.quality.title'), description: this.$t('about.values.quality.description') },
        { icon: this.icons.speed, title: this.$t('about.values.speed.title'), description: this.$t('about.values.speed.description') },
        { icon: this.icons.expertise, title: this.$t('about.values.expertise.title'), description: this.$t('about.values.expertise.description') }
      ]
    },
    reasonItems() {
      return [
        { title: this.$t('about.reasons.experience.title'), description: this.$t('about.reasons.experience.description') },
        { title: this.$t('about.reasons.location.title'), description: this.$t('about.reasons.location.description') },
        { title: this.$t('about.reasons.equipment.title'), description: this.$t('about.reasons.equipment.description') },
        { title: this.$t('about.reasons.flexibility.title'), description: this.$t('about.reasons.flexibility.description') },
        { title: this.$t('about.reasons.support.title'), description: this.$t('about.reasons.support.description') },
        { title: this.$t('about.reasons.price.title'), description: this.$t('about.reasons.price.description') }
      ]
    }
  }
}
</script>
