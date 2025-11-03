<template>
  <header class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300" :class="{ 'bg-white/95 shadow-xl': scrolled }">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-4 group">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span class="text-white font-bold text-lg">DSK</span>
          </div>
          <h1 class="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">DSK-UG</h1>
        </router-link>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link 
            v-for="item in navItems" 
            :key="item.key"
            :to="item.path" 
            class="relative text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 py-2 px-1 group"
            active-class="text-blue-600"
          >
            {{ $t(`nav.${item.key}`) }}
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300 group-hover:w-full"></span>
          </router-link>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <!-- CTA Button -->
          <router-link 
            to="/buchung" 
            class="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {{ $t('hero.cta1') }}
          </router-link>

          <!-- Language Switcher -->
          <div class="relative">
            <button 
              @click="toggleLanguageDropdown"
              class="flex items-center space-x-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            >
              <img :src="getCurrentFlag()" :alt="currentLocale" class="w-5 h-4 object-cover rounded-sm" />
              <span class="font-medium">{{ currentLocale.toUpperCase() }}</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': languageDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Language Dropdown -->
            <div 
              v-if="languageDropdownOpen" 
              class="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in"
            >
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="selectLanguage(lang.code)"
                class="w-full flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors duration-200"
                :class="{ 'bg-blue-50 text-blue-600': currentLocale === lang.code }"
              >
                <img :src="lang.flag" :alt="lang.code" class="w-5 h-4 object-cover rounded-sm" />
                <span class="font-medium">{{ lang.name }}</span>
              </button>
            </div>
          </div>

          <!-- Mobile menu button -->
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <svg class="w-6 h-6 transition-transform duration-300" :class="{ 'rotate-90': mobileMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <transition name="mobile-menu">
        <div v-if="mobileMenuOpen" class="md:hidden mt-4 pb-4 border-t border-gray-200/50">
          <nav class="flex flex-col space-y-1 pt-4">
            <router-link 
              v-for="item in navItems" 
              :key="item.key"
              :to="item.path" 
              @click="mobileMenuOpen = false"
              class="text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
              active-class="text-blue-600 bg-blue-50"
            >
              {{ $t(`nav.${item.key}`) }}
            </router-link>
            
            <!-- Mobile CTA -->
            <router-link 
              to="/buchung" 
              @click="mobileMenuOpen = false"
              class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-center mt-4 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              {{ $t('hero.cta1') }}
            </router-link>
          </nav>
        </div>
      </transition>
    </div>
  </header>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'Header',
  setup() {
    const { locale } = useI18n()
    return { locale }
  },
  data() {
    return {
      mobileMenuOpen: false,
      languageDropdownOpen: false,
      scrolled: false,
      currentLocale: 'de',
      languages: [
        { code: 'de', name: 'Deutsch', flag: '/src/assets/flags/de.svg' },
        { code: 'en', name: 'English', flag: '/src/assets/flags/en.svg' },
        { code: 'pl', name: 'Polski', flag: '/src/assets/flags/pl.svg' },
        { code: 'ro', name: 'Română', flag: '/src/assets/flags/ro.svg' },
        { code: 'ru', name: 'Русский', flag: '/src/assets/flags/ru.svg' },
        { code: 'uk', name: 'Українська', flag: '/src/assets/flags/uk.svg' }
      ],
      navItems: [
        { key: 'home', path: '/' },
        { key: 'accommodations', path: '/unterkuenfte' },
        { key: 'booking', path: '/buchung' },
        { key: 'about', path: '/ueber-uns' },
        { key: 'contact', path: '/kontakt' },
        { key: 'faq', path: '/faq' }
      ]
    }
  },
  mounted() {
    this.currentLocale = this.locale
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    toggleLanguageDropdown() {
      this.languageDropdownOpen = !this.languageDropdownOpen
    },
    selectLanguage(langCode) {
      this.currentLocale = langCode
      this.locale = langCode
      this.languageDropdownOpen = false
    },
    changeLanguage() {
      this.locale = this.currentLocale
    },
    getCurrentFlag() {
      const lang = this.languages.find(l => l.code === this.currentLocale)
      return lang ? lang.flag : '/src/assets/flags/de.svg'
    },
    handleScroll() {
      this.scrolled = window.scrollY > 50
    },
    handleClickOutside(event) {
      if (!event.target.closest('.relative')) {
        this.languageDropdownOpen = false
      }
    }
  }
}
</script>

<style scoped>
/* Mobile menu transitions */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Language dropdown animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

/* Glassmorphism backdrop support */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-md {
    backdrop-filter: blur(12px);
  }
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
}

/* Hover effects for navigation underline */
.group:hover .group-hover\:w-full {
  width: 100%;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
