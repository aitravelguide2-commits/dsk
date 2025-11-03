<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center animate-fade-in-down">
          {{ $t('legal.impressum.title') }}
        </h1>
        
        <div class="space-y-8">
          <!-- Company Information -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.impressum.company.title') }}
            </h2>
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="mb-2"><strong>{{ $t('legal.impressum.company.name') }}:</strong> DSK UG Monteurunterkünfte Leipzig</p>
              <p class="mb-2"><strong>{{ $t('legal.impressum.company.address') }}:</strong></p>
              <p class="ml-4 mb-2">Musterstraße 123</p>
              <p class="ml-4 mb-2">04109 Leipzig</p>
              <p class="ml-4 mb-4">Deutschland</p>
              
              <p class="mb-2"><strong>{{ $t('legal.impressum.company.phone') }}:</strong> +49 151 71421923</p>
              <p class="mb-2"><strong>{{ $t('legal.impressum.company.email') }}:</strong> info@dsk-ug-leipzig.de</p>
              <p class="mb-2"><strong>{{ $t('legal.impressum.company.website') }}:</strong> www.dsk-ug-leipzig.de</p>
            </div>
          </section>

          <!-- Legal Representatives -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.impressum.representatives.title') }}
            </h2>
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="mb-2"><strong>{{ $t('legal.impressum.representatives.managing') }}:</strong> Petra Scheffler</p>
              <p class="mb-2"><strong>{{ $t('legal.impressum.representatives.owner') }}:</strong> Erol Karaca</p>
              <p class="mb-2"><strong>{{ $t('legal.impressum.representatives.contact') }}:</strong> geschaeftsleitung@dsk-ug-leipzig.de</p>
            </div>
          </section>

          <!-- Registration -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.impressum.registration.title') }}
            </h2>
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="mb-2"><strong>{{ $t('legal.impressum.registration.court') }}:</strong> Amtsgericht Leipzig</p>
              <p class="mb-2"><strong>{{ $t('legal.impressum.registration.number') }}:</strong> HRB 12345</p>
              <p class="mb-2"><strong>{{ $t('legal.impressum.registration.tax') }}:</strong> DE123456789</p>
            </div>
          </section>

          <!-- Liability -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.impressum.liability.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.impressum.liability.content') }}
              </p>
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.impressum.liability.links') }}
              </p>
            </div>
          </section>

          <!-- Copyright -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.impressum.copyright.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.impressum.copyright.content') }}
              </p>
            </div>
          </section>

          <!-- Dispute Resolution -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.impressum.dispute.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.impressum.dispute.content') }}
              </p>
              <p class="text-gray-700 leading-relaxed">
                <strong>{{ $t('legal.impressum.dispute.platform') }}:</strong> 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" class="text-blue-600 hover:text-blue-800 underline">
                  https://ec.europa.eu/consumers/odr/
                </a>
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
  name: 'Impressum',
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