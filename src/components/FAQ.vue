<template>
  <div class="min-h-screen py-8 bg-gray-50">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        Häufig gestellte Fragen
      </h1>

      <div class="space-y-4">
        <div v-for="faq in faqs" :key="faq.id" class="bg-white rounded-xl shadow-lg">
          <button 
            @click="toggleFAQ(faq.id)"
            class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-xl transition-colors"
          >
            <span class="font-semibold text-gray-800 text-lg">{{ faq.question }}</span>
            <svg 
              :class="['w-5 h-5 text-gray-500 transition-transform', faq.open ? 'rotate-180' : '']" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <div v-if="faq.open" class="px-6 pb-4">
            <p class="text-gray-600 leading-relaxed">{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Additional Help -->
      <div class="mt-12 bg-blue-600 rounded-xl shadow-lg p-8 text-center text-white">
        <h2 class="text-2xl font-bold mb-4">Haben Sie weitere Fragen?</h2>
        <p class="text-blue-100 mb-6">Unser Team steht Ihnen gerne zur Verfügung</p>
        <button 
          @click="$router.push('/kontakt')"
          class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Kontakt aufnehmen
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FAQ',
  data() {
    return {
      faqs: [
        {
          id: 1,
          question: 'Wie buche ich eine Unterkunft?',
          answer: 'Sie können direkt über unsere Webseite buchen. Wählen Sie Ihre gewünschte Unterkunft, geben Sie die Daten ein und füllen Sie das Buchungsformular aus. Sie erhalten umgehend eine Bestätigung.',
          open: false
        },
        {
          id: 2,
          question: 'Kann ich kurzfristig buchen?',
          answer: 'Ja, wir bieten kurzfristige Buchungen an. Viele unserer Unterkünfte sind sofort verfügbar. Bei dringenden Anfragen kontaktieren Sie uns bitte telefonisch.',
          open: false
        },
        {
          id: 3,
          question: 'Was ist im Preis enthalten?',
          answer: 'Der Preis beinhaltet die Unterkunft, WLAN, Parkplatz, Nebenkosten und Endreinigung. Zusätzliche Leistungen wie Reinigungsservice können optional gebucht werden.',
          open: false
        },
        {
          id: 4,
          question: 'Gibt es Stornierungsbedingungen?',
          answer: 'Sie können bis zu 48 Stunden vor Anreise kostenlos stornieren. Bei späteren Stornierungen fallen 50% des Gesamtpreises an. Bei Nichtantritt wird der volle Preis berechnet.',
          open: false
        },
        {
          id: 5,
          question: 'Sind Haustiere erlaubt?',
          answer: 'In den meisten Unterkünften sind Haustiere leider nicht gestattet. Bitte kontaktieren Sie uns für spezielle Anfragen.',
          open: false
        },
        {
          id: 6,
          question: 'Gibt es WLAN in allen Unterkünften?',
          answer: 'Ja, alle unsere Unterkünfte verfügen über kostenloses High-Speed WLAN für berufliche und private Nutzung.',
          open: false
        },
        {
          id: 7,
          question: 'Kann ich für mein Team mehrere Unterkünfte buchen?',
          answer: 'Ja, wir bieten spezielle Teamlösungen an. Kontaktieren Sie uns für maßgeschneiderte Angebote für größere Gruppen.',
          open: false
        },
        {
          id: 8,
          question: 'Wie erfolgt die Schlüsselübergabe?',
          answer: 'Wir bieten verschiedene Optionen: Selbstabholung an einem vereinbarten Ort, Schlüsseltresor oder persönliche Übergabe. Die Details erhalten Sie nach der Buchung.',
          open: false
        }
      ]
    }
  },
  methods: {
    toggleFAQ(id) {
      this.faqs = this.faqs.map(faq => ({
        ...faq,
        open: faq.id === id ? !faq.open : false
      }))
    }
  }
}
</script>
