<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          {{ $t('about.title') }}
        </h1>
        <p class="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {{ $t('about.description') }}
        </p>
      </div>

      <!-- Experience Timeline -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">Unsere Erfahrung</h2>
        
        <div class="space-y-8">
          <div v-for="item in experience" :key="item.year" class="flex">
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
        <div v-for="value in values" :key="value.title" class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-blue-600 text-2xl">{{ value.icon }}</span>
          </div>
          <h3 class="font-semibold text-gray-800 mb-2">{{ value.title }}</h3>
          <p class="text-gray-600 text-sm">{{ value.description }}</p>
        </div>
      </div>

      <!-- Why Choose Us -->
      <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <h2 class="text-2xl font-bold mb-8 text-center">Warum DSK-UG wählen?</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="reason in reasons" :key="reason.title" class="flex items-start">
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
export default {
  name: 'About',
  data() {
    return {
      experience: [
        {
          year: '2014',
          title: 'Gründung von DSK-UG',
          description: 'Beginn mit spezialisierten Unterkünften für Monteure und Bauarbeiter in Leipzig'
        },
        {
          year: '2016',
          title: 'Erweiterung des Angebots',
          description: 'Ausbau auf mehrere Standorte in Leipzig mit verschiedenen Unterkunftstypen'
        },
        {
          year: '2018',
          title: 'Digitalisierung',
          description: 'Einführung des Online-Buchungssystems für einfache Reservierungen'
        },
        {
          year: '2020',
          title: 'Internationale Kunden',
          description: 'Erweiterung um mehrsprachigen Service für internationale Montageteams'
        },
        {
          year: '2023',
          title: 'Qualitätssicherung',
          description: 'Einführung strenger Qualitätsstandards für alle Unterkünfte'
        }
      ],
      values: [
        {
          icon: '🤝',
          title: 'Partnerschaft',
          description: 'Langfristige Zusammenarbeit mit unseren Kunden'
        },
        {
          icon: '⭐',
          title: 'Qualität',
          description: 'Höchste Standards in allen unseren Unterkünften'
        },
        {
          icon: '⚡',
          title: 'Schnelligkeit',
          description: 'Sofortige Verfügbarkeit und schnelle Buchung'
        },
        {
          icon: '🛠️',
          title: 'Fachwissen',
          description: 'Tiefes Verständnis für die Bedürfnisse von Monteuren'
        }
      ],
      reasons: [
        {
          title: 'Erfahrung',
          description: 'Über 10 Jahre Erfahrung mit Monteurunterkünften'
        },
        {
          title: 'Standort',
          description: 'Strategische Lage in Leipzig für optimale Erreichbarkeit'
        },
        {
          title: 'Ausstattung',
          description: 'Voll ausgestattete Unterkünfte für maximalen Komfort'
        },
        {
          title: 'Flexibilität',
          description: 'Anpassbare Buchungen für variable Projektzeiten'
        },
        {
          title: 'Support',
          description: '24/7 Unterstützung für unsere Kunden'
        },
        {
          title: 'Preis',
          description: 'Faire Preise ohne versteckte Kosten'
        }
      ]
    }
  }
}
</script>
