<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center animate-fade-in-down">
          {{ $t('legal.terms.title') }}
        </h1>
        
        <div class="space-y-8">
          <!-- Scope -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.scope.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.scope.content') }}
              </p>
            </div>
          </section>

          <!-- Booking Process -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.booking.title') }}
            </h2>
            <div class="prose max-w-none">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.terms.booking.process.title') }}</h3>
              <ol class="list-decimal list-inside mb-6 text-gray-700 space-y-2">
                <li>{{ $t('legal.terms.booking.process.step1') }}</li>
                <li>{{ $t('legal.terms.booking.process.step2') }}</li>
                <li>{{ $t('legal.terms.booking.process.step3') }}</li>
                <li>{{ $t('legal.terms.booking.process.step4') }}</li>
              </ol>
              
              <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.terms.booking.confirmation.title') }}</h3>
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.booking.confirmation.content') }}
              </p>
            </div>
          </section>

          <!-- Prices and Payment -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.payment.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.payment.prices') }}
              </p>
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.payment.methods') }}
              </p>
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.payment.due') }}
              </p>
            </div>
          </section>

          <!-- Cancellation -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.cancellation.title') }}
            </h2>
            <div class="prose max-w-none">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.terms.cancellation.guest.title') }}</h3>
              <ul class="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>{{ $t('legal.terms.cancellation.guest.free') }}</li>
                <li>{{ $t('legal.terms.cancellation.guest.partial') }}</li>
                <li>{{ $t('legal.terms.cancellation.guest.full') }}</li>
              </ul>
              
              <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.terms.cancellation.host.title') }}</h3>
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.cancellation.host.content') }}
              </p>
            </div>
          </section>

          <!-- Check-in/Check-out -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.checkin.title') }}
            </h2>
            <div class="prose max-w-none">
              <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.terms.checkin.in.title') }}</h3>
                  <p class="text-gray-700">{{ $t('legal.terms.checkin.in.time') }}</p>
                  <p class="text-gray-700">{{ $t('legal.terms.checkin.in.process') }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('legal.terms.checkin.out.title') }}</h3>
                  <p class="text-gray-700">{{ $t('legal.terms.checkin.out.time') }}</p>
                  <p class="text-gray-700">{{ $t('legal.terms.checkin.out.process') }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- House Rules -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.rules.title') }}
            </h2>
            <div class="prose max-w-none">
              <ul class="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>{{ $t('legal.terms.rules.smoking') }}</li>
                <li>{{ $t('legal.terms.rules.pets') }}</li>
                <li>{{ $t('legal.terms.rules.noise') }}</li>
                <li>{{ $t('legal.terms.rules.guests') }}</li>
                <li>{{ $t('legal.terms.rules.damage') }}</li>
                <li>{{ $t('legal.terms.rules.cleaning') }}</li>
              </ul>
            </div>
          </section>

          <!-- Liability -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.liability.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.liability.content') }}
              </p>
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.liability.limitation') }}
              </p>
            </div>
          </section>

          <!-- Data Protection -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.dataProtection.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.dataProtection.content') }}
              </p>
            </div>
          </section>

          <!-- Applicable Law -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.law.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.law.content') }}
              </p>
            </div>
          </section>

          <!-- Final Provisions -->
          <section class="fade-in-on-scroll">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              {{ $t('legal.terms.final.title') }}
            </h2>
            <div class="prose max-w-none">
              <p class="mb-4 text-gray-700 leading-relaxed">
                {{ $t('legal.terms.final.content') }}
              </p>
              <p class="text-sm text-gray-600">
                {{ $t('legal.terms.final.lastUpdated') }}: {{ new Date().toLocaleDateString($i18n.locale) }}
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