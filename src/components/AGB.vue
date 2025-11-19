<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center animate-fade-in-down">
          {{ $t('legal.agb.title') }}
        </h1>
        
        <div class="space-y-8">
          <!-- Scope -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.scope.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.scope.content') }}
              </p>
            </div>
          </section>

          <!-- Booking -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.booking.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.booking.content') }}
              </p>
            </div>
          </section>

          <!-- Prices and Payment -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.prices.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.prices.content') }}
              </p>
            </div>
          </section>

          <!-- Cancellation -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.cancellation.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.cancellation.content') }}
              </p>
            </div>
          </section>

          <!-- Check-in/Check-out -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.checkin.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.checkin.content') }}
              </p>
            </div>
          </section>

          <!-- House Rules -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.rules.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.rules.content') }}
              </p>
            </div>
          </section>

          <!-- Liability -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.liability.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.liability.content') }}
              </p>
            </div>
          </section>

          <!-- Warranty -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.warranty.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.warranty.content') }}
              </p>
            </div>
          </section>

          <!-- Data Protection -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.privacy.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.privacy.content') }}
              </p>
            </div>
          </section>

          <!-- Applicable Law -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.law.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.law.content') }}
              </p>
            </div>
          </section>

          <!-- Final Provisions -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.agb.final.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.agb.final.content') }}
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
            {{ $t('legal.agb.backButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AGB',
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
