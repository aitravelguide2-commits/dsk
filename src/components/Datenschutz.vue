<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center animate-fade-in-down">
          {{ $t('legal.privacy.title') }}
        </h1>
        
        <div class="space-y-8">
          <!-- Introduction -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.intro.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.privacy.intro.content') }}
              </p>
            </div>
          </section>

          <!-- Data Controller -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.controller.title') }}
            </h2>
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="mb-2"><strong>{{ $t('legal.privacy.controller.company') }}:</strong> DSK UG Monteurunterkünfte Leipzig</p>
              <p class="mb-2"><strong>{{ $t('legal.privacy.controller.address') }}:</strong></p>
              <p class="ml-4 mb-2">Musterstraße 123</p>
              <p class="ml-4 mb-2">04109 Leipzig</p>
              <p class="ml-4 mb-4">Deutschland</p>
              <p class="mb-2"><strong>{{ $t('legal.privacy.controller.email') }}:</strong> datenschutz@dsk-ug-leipzig.de</p>
              <p class="mb-2"><strong>{{ $t('legal.privacy.controller.phone') }}:</strong> +49 151 71421923</p>
            </div>
          </section>

          <!-- Data Collection -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.collection.title') }}
            </h2>
            <div class="prose max-w-none">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.privacy.collection.personal.title') }}</h3>
              <ul class="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>{{ $t('legal.privacy.collection.personal.name') }}</li>
                <li>{{ $t('legal.privacy.collection.personal.email') }}</li>
                <li>{{ $t('legal.privacy.collection.personal.phone') }}</li>
                <li>{{ $t('legal.privacy.collection.personal.address') }}</li>
                <li>{{ $t('legal.privacy.collection.personal.booking') }}</li>
              </ul>
              
              <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.privacy.collection.technical.title') }}</h3>
              <ul class="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>{{ $t('legal.privacy.collection.technical.ip') }}</li>
                <li>{{ $t('legal.privacy.collection.technical.browser') }}</li>
                <li>{{ $t('legal.privacy.collection.technical.device') }}</li>
                <li>{{ $t('legal.privacy.collection.technical.cookies') }}</li>
              </ul>
            </div>
          </section>

          <!-- Purpose of Processing -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.purpose.title') }}
            </h2>
            <div class="prose max-w-none">
              <ul class="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>{{ $t('legal.privacy.purpose.booking') }}</li>
                <li>{{ $t('legal.privacy.purpose.communication') }}</li>
                <li>{{ $t('legal.privacy.purpose.improvement') }}</li>
                <li>{{ $t('legal.privacy.purpose.legal') }}</li>
                <li>{{ $t('legal.privacy.purpose.marketing') }}</li>
              </ul>
            </div>
          </section>

          <!-- Legal Basis -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.basis.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.privacy.basis.content') }}
              </p>
            </div>
          </section>

          <!-- Data Sharing -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.sharing.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.privacy.sharing.content') }}
              </p>
            </div>
          </section>

          <!-- Data Retention -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.retention.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.privacy.retention.content') }}
              </p>
            </div>
          </section>

          <!-- Your Rights -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.rights.title') }}
            </h2>
            <div class="prose max-w-none">
              <ul class="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>{{ $t('legal.privacy.rights.access') }}</li>
                <li>{{ $t('legal.privacy.rights.rectification') }}</li>
                <li>{{ $t('legal.privacy.rights.erasure') }}</li>
                <li>{{ $t('legal.privacy.rights.restriction') }}</li>
                <li>{{ $t('legal.privacy.rights.portability') }}</li>
                <li>{{ $t('legal.privacy.rights.objection') }}</li>
                <li>{{ $t('legal.privacy.rights.complaint') }}</li>
              </ul>
            </div>
          </section>

          <!-- Cookies -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.cookies.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.privacy.cookies.content') }}
              </p>
            </div>
          </section>

          <!-- Updates -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.privacy.updates.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.privacy.updates.content') }}
              </p>
              <p class="text-sm text-gray-600">
                {{ $t('legal.privacy.updates.lastUpdated') }}: {{ new Date().toLocaleDateString($i18n.locale) }}
              </p>
            </div>
          </section>
        </div>

        <!-- Back Button -->
        <div class="mt-12 text-center">
          <button 
            @click="$router.go(-1)"
            class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors btn-ripple hover-lift"
          >
            {{ $t('legal.back') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Datenschutz',
  mounted() {
    this.initScrollAnimations()
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    initScrollAnimations() {
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

      this.$nextTick(() => {
        const elements = this.$el.querySelectorAll('.fade-in-on-scroll')
        elements.forEach(el => {
          this.observer.observe(el)
        })
      })
    }
  }
}
</script>