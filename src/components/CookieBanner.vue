<template>
  <div>
    <!-- Banner -->
    <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 z-50" role="region" aria-label="Cookie-Banner">
      <div class="mx-4 mb-4 rounded-lg shadow-xl bg-white border border-gray-200 p-4 md:p-6">
        <div class="md:flex md:items-center md:justify-between">
          <div class="md:max-w-2xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('cookie.banner.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('cookie.banner.description') }}</p>
          </div>
          <div class="mt-4 md:mt-0 flex gap-2">
            <button class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300" @click="rejectOptional">{{ $t('cookie.banner.rejectOptional') }}</button>
            <button class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" @click="acceptAll">{{ $t('cookie.banner.acceptAll') }}</button>
            <button class="px-4 py-2 rounded-md bg-white text-gray-800 border border-gray-300 hover:bg-gray-50" @click="openSettings">{{ $t('cookie.banner.settings') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Settings -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" @keydown.esc="onEsc" aria-hidden="false">
      <div ref="modalRef" class="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6" role="dialog" :aria-label="$t('cookie.a11y.modalLabel')" aria-modal="true" aria-labelledby="cookieSettingsTitle">
        <div class="flex items-center justify-between mb-4">
          <h3 id="cookieSettingsTitle" class="text-xl font-semibold text-gray-900">{{ $t('cookie.banner.settings') }}</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeSettings" :aria-label="$t('cookie.a11y.close')">✕</button>
        </div>

        <div class="space-y-4">
          <div class="p-3 rounded-md border border-gray-200">
            <div class="flex items-start gap-3">
              <input id="cookie-essential" type="checkbox" checked disabled class="mt-1"/>
              <div>
                <label for="cookie-essential" class="font-medium">{{ $t('cookie.categories.essential') }}</label>
                <div class="text-sm text-gray-600">{{ $t('cookie.categories.explanationEssential') }}</div>
              </div>
            </div>
          </div>
          <div class="p-3 rounded-md border border-gray-200">
            <div class="flex items-start gap-3">
              <input id="cookie-functional" type="checkbox" v-model="consent.functional" class="mt-1"/>
              <div>
                <label for="cookie-functional" class="font-medium">{{ $t('cookie.categories.functional') }}</label>
                <div class="text-sm text-gray-600">{{ $t('cookie.categories.functionalDesc') }}</div>
              </div>
            </div>
          </div>
          <div class="p-3 rounded-md border border-gray-200">
            <div class="flex items-start gap-3">
              <input id="cookie-analytics" type="checkbox" v-model="consent.analytics" class="mt-1"/>
              <div>
                <label for="cookie-analytics" class="font-medium">{{ $t('cookie.categories.analytics') }}</label>
                <div class="text-sm text-gray-600">{{ $t('cookie.categories.analyticsDesc') }}</div>
              </div>
            </div>
          </div>
          <div class="p-3 rounded-md border border-gray-200">
            <div class="flex items-start gap-3">
              <div class="flex-1">
                <div class="font-medium mb-1">{{ $t('cookie.variables.title') }}</div>
                <div class="text-sm text-gray-600 mb-3">{{ $t('cookie.variables.description') }}</div>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <dt class="text-xs text-gray-500">{{ $t('cookie.variables.selectedCategories') }}</dt>
                    <dd class="text-sm text-gray-800">{{ selectedCategoriesText }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500">{{ $t('cookie.variables.lastUpdated') }}</dt>
                    <dd class="text-sm text-gray-800">{{ consent.updatedAt || '—' }}</dd>
                  </div>
                </dl>
                <div class="mt-3">
                  <button class="px-3 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200" @click="toggleTechDetails">
                    {{ showTech ? $t('cookie.variables.hideTechnical') : $t('cookie.variables.showTechnical') }}
                  </button>
                </div>
                <div v-if="showTech" class="mt-3 text-sm">
                  <div class="mb-2"><span class="text-gray-500">{{ $t('cookie.variables.storageKey') }}:</span> <code class="text-gray-800">cookieConsent</code></div>
                  <div>
                    <div class="text-gray-500 mb-1">{{ $t('cookie.variables.rawJson') }}:</div>
                    <pre class="bg-gray-50 border border-gray-200 rounded p-3 overflow-auto text-xs">{{ rawConsent }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300" @click="closeSettings">{{ $t('common.cancel') || 'Abbrechen' }}</button>
          <button class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" @click="saveConsent">{{ $t('cookie.banner.save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CookieBanner',
  data() {
    return {
      showBanner: false,
      showModal: false,
      consent: {
        essential: true,
        functional: false,
        analytics: false,
        updatedAt: null
      },
      showTech: false
    }
  },
  mounted() {
    // Listen for global event from Footer
    window.addEventListener('open-cookie-settings', this.handleOpenSettings)
    // Load stored consent
    try {
      const stored = localStorage.getItem('cookieConsent')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.consent = { ...this.consent, ...parsed }
        this.showBanner = false
      } else {
        this.showBanner = true
      }
    } catch (e) {
      this.showBanner = true
    }
  },
  beforeUnmount() {
    window.removeEventListener('open-cookie-settings', this.handleOpenSettings)
  },
  methods: {
    handleOpenSettings() {
      this.showModal = true
      this.$nextTick(this.focusFirst)
    },
    openSettings() {
      this.showModal = true
      this.$nextTick(this.focusFirst)
    },
    closeSettings() {
      this.showModal = false
      this.showTech = false
    },
    saveConsent() {
      this.consent.updatedAt = new Date().toISOString()
      localStorage.setItem('cookieConsent', JSON.stringify(this.consent))
      this.showBanner = false
      this.showModal = false
      try {
        const event = new CustomEvent('cookie-consent-updated', { detail: this.consent })
        window.dispatchEvent(event)
      } catch (e) {}
    },
    acceptAll() {
      this.consent.functional = true
      this.consent.analytics = true
      this.saveConsent()
    },
    rejectOptional() {
      this.consent.functional = false
      this.consent.analytics = false
      this.saveConsent()
    },
    toggleTechDetails() {
      this.showTech = !this.showTech
    },
    onEsc() {
      this.closeSettings()
    },
    focusFirst() {
      try {
        const el = this.$refs.modalRef
        if (!el) return
        const focusables = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (focusables.length) focusables[0].focus()
      } catch (e) {}
    }
  },
  computed: {
    selectedCategoriesText() {
      const selected = []
      if (this.consent.essential) selected.push(this.$t('cookie.categories.essential'))
      if (this.consent.functional) selected.push(this.$t('cookie.categories.functional'))
      if (this.consent.analytics) selected.push(this.$t('cookie.categories.analytics'))
      return selected.length ? selected.join(', ') : '—'
    },
    rawConsent() {
      try { return JSON.stringify(this.consent, null, 2) } catch (e) { return '' }
    }
  }
}
</script>

<style scoped>
</style>
