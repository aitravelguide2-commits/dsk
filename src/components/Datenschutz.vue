<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center animate-fade-in-down">
          {{ $t('legal.datenschutz.title') }}
        </h1>
        
        <div class="space-y-8">
          <!-- Introduction -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.intro.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.intro.content') }}
              </p>
            </div>
          </section>

          <!-- Data Controller -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.controller.title') }}
            </h2>
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="mb-2"><strong>Verantwortlicher:</strong> DSK UG Monteurunterkünfte Leipzig</p>
              <p class="mb-2"><strong>Adresse:</strong></p>
              <p class="ml-4 mb-2">Engertstraße 6a</p>
              <p class="ml-4 mb-2">04177 Leipzig</p>
              <p class="ml-4 mb-4">Deutschland</p>
              <p class="mb-2"><strong>E-Mail:</strong> info@dsk-ug.de</p>
              <p class="mb-2"><strong>Telefon:</strong> +49 151 71421923</p>
            </div>
          </section>

          <!-- Data Collection -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.collection.title') }}
            </h2>
            <div class="prose max-w-none">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.datenschutz.collection.personal.title') }}</h3>
              <ul class="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>Name</li>
                <li>E-Mail</li>
                <li>Telefonnummer</li>
                <li>Adresse</li>
                <li>Buchungsdetails</li>
              </ul>
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.collection.personal.content') }}
              </p>

              <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.datenschutz.collection.technical.title') }}</h3>
              <ul class="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>IP-Adresse</li>
                <li>Browser- und Gerätedaten</li>
                <li>Nutzungsdaten</li>
                <li>Cookies</li>
              </ul>
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.collection.technical.content') }}
              </p>
            </div>
          </section>

          <!-- Purpose of Processing -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.purpose.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.purpose.content') }}
              </p>
            </div>
          </section>

          <!-- Legal Basis -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.legal.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.legal.content') }}
              </p>
            </div>
          </section>

          <!-- Data Sharing -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.sharing.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.sharing.content') }}
              </p>
            </div>
          </section>

          <!-- Data Retention -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.retention.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.retention.content') }}
              </p>
            </div>
          </section>

          <!-- Your Rights -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.rights.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.rights.content') }}
              </p>
            </div>
          </section>

          <!-- Cookies -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.cookies.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.cookies.content') }}
              </p>
            </div>
          </section>

          <!-- Updates -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.datenschutz.updates.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.datenschutz.updates.content') }}
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
            {{ $t('legal.datenschutz.backButton') }}
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
