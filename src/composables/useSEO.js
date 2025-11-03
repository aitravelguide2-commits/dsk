import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useSEO() {
  const { locale } = useI18n()
  
  const updateMetaTag = (name, content) => {
    let element = document.querySelector(`meta[name="${name}"]`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute('name', name)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }
  
  const updatePropertyTag = (property, content) => {
    let element = document.querySelector(`meta[property="${property}"]`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute('property', property)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }
  
  const setPageSEO = (seoData) => {
    // Update title
    if (seoData.title) {
      document.title = seoData.title
    }
    
    // Update meta description
    if (seoData.description) {
      updateMetaTag('description', seoData.description)
    }
    
    // Update keywords
    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords)
    }
    
    // Update Open Graph tags
    if (seoData.ogTitle) {
      updatePropertyTag('og:title', seoData.ogTitle)
    }
    
    if (seoData.ogDescription) {
      updatePropertyTag('og:description', seoData.ogDescription)
    }
    
    if (seoData.ogImage) {
      updatePropertyTag('og:image', seoData.ogImage)
    }
    
    if (seoData.ogUrl) {
      updatePropertyTag('og:url', seoData.ogUrl)
    }
    
    // Update Twitter Card tags
    if (seoData.twitterTitle) {
      updateMetaTag('twitter:title', seoData.twitterTitle)
    }
    
    if (seoData.twitterDescription) {
      updateMetaTag('twitter:description', seoData.twitterDescription)
    }
    
    if (seoData.twitterImage) {
      updateMetaTag('twitter:image', seoData.twitterImage)
    }
    
    // Update canonical URL
    if (seoData.canonical) {
      let canonicalElement = document.querySelector('link[rel="canonical"]')
      if (!canonicalElement) {
        canonicalElement = document.createElement('link')
        canonicalElement.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalElement)
      }
      canonicalElement.setAttribute('href', seoData.canonical)
    }
    
    // Update language
    document.documentElement.setAttribute('lang', locale.value)
  }
  
  // Watch for locale changes and update lang attribute
  watch(locale, (newLocale) => {
    document.documentElement.setAttribute('lang', newLocale)
  })
  
  return {
    setPageSEO
  }
}

// SEO data for different pages
export const seoData = {
  home: {
    de: {
      title: 'DSK-UG - Monteurunterkünfte Leipzig | Günstige Übernachtung für Monteure',
      description: 'DSK-UG bietet hochwertige Monteurunterkünfte in Leipzig. Komfortable, saubere und günstige Unterkünfte für Monteure, Handwerker und Geschäftsreisende.',
      keywords: 'Monteurunterkünfte Leipzig, Monteurzimmer, Handwerkerunterkünfte, günstige Übernachtung Leipzig, Arbeiterunterkünfte',
      ogTitle: 'DSK-UG - Monteurunterkünfte Leipzig',
      ogDescription: 'Hochwertige und günstige Monteurunterkünfte in Leipzig für Handwerker und Geschäftsreisende.',
      twitterTitle: 'DSK-UG - Monteurunterkünfte Leipzig',
      twitterDescription: 'Hochwertige und günstige Monteurunterkünfte in Leipzig für Handwerker und Geschäftsreisende.'
    },
    en: {
      title: 'DSK-UG - Worker Accommodation Leipzig | Affordable Lodging for Workers',
      description: 'DSK-UG offers high-quality worker accommodation in Leipzig. Comfortable, clean and affordable lodging for workers, craftsmen and business travelers.',
      keywords: 'worker accommodation Leipzig, worker rooms, craftsman lodging, affordable accommodation Leipzig, worker housing',
      ogTitle: 'DSK-UG - Worker Accommodation Leipzig',
      ogDescription: 'High-quality and affordable worker accommodation in Leipzig for craftsmen and business travelers.',
      twitterTitle: 'DSK-UG - Worker Accommodation Leipzig',
      twitterDescription: 'High-quality and affordable worker accommodation in Leipzig for craftsmen and business travelers.'
    },
    pl: {
      title: 'DSK-UG - Noclegi dla Monterów Lipsk | Tanie Zakwaterowanie dla Monterów',
      description: 'DSK-UG oferuje wysokiej jakości noclegi dla monterów w Lipsku. Wygodne, czyste i tanie zakwaterowanie dla monterów, rzemieślników i podróżnych służbowych.',
      keywords: 'noclegi dla monterów Lipsk, pokoje monterskie, zakwaterowanie rzemieślników, tanie noclegi Lipsk',
      ogTitle: 'DSK-UG - Noclegi dla Monterów Lipsk',
      ogDescription: 'Wysokiej jakości i tanie noclegi dla monterów w Lipsku dla rzemieślników i podróżnych służbowych.',
      twitterTitle: 'DSK-UG - Noclegi dla Monterów Lipsk',
      twitterDescription: 'Wysokiej jakości i tanie noclegi dla monterów w Lipsku dla rzemieślników i podróżnych służbowych.'
    },
    ro: {
      title: 'DSK-UG - Cazare Muncitori Leipzig | Cazare Ieftină pentru Muncitori',
      description: 'DSK-UG oferă cazare de înaltă calitate pentru muncitori în Leipzig. Cazare confortabilă, curată și ieftină pentru muncitori, meșteri și călători de afaceri.',
      keywords: 'cazare muncitori Leipzig, camere muncitori, cazare meșteri, cazare ieftină Leipzig',
      ogTitle: 'DSK-UG - Cazare Muncitori Leipzig',
      ogDescription: 'Cazare de înaltă calitate și ieftină pentru muncitori în Leipzig pentru meșteri și călători de afaceri.',
      twitterTitle: 'DSK-UG - Cazare Muncitori Leipzig',
      twitterDescription: 'Cazare de înaltă calitate și ieftină pentru muncitori în Leipzig pentru meșteri și călători de afaceri.'
    }
  },
  accommodations: {
    de: {
      title: 'Unterkünfte - DSK-UG Leipzig | Alle Monteurunterkünfte im Überblick',
      description: 'Entdecken Sie alle verfügbaren Monteurunterkünfte von DSK-UG in Leipzig. Verschiedene Zimmertypen und Ausstattungen für jeden Bedarf.',
      keywords: 'Monteurunterkünfte Leipzig, Zimmer buchen, Unterkunft Leipzig, Monteurzimmer Auswahl'
    },
    en: {
      title: 'Accommodations - DSK-UG Leipzig | All Worker Accommodations Overview',
      description: 'Discover all available worker accommodations from DSK-UG in Leipzig. Various room types and amenities for every need.',
      keywords: 'worker accommodations Leipzig, book rooms, accommodation Leipzig, worker room selection'
    },
    pl: {
      title: 'Noclegi - DSK-UG Lipsk | Wszystkie Noclegi dla Monterów',
      description: 'Odkryj wszystkie dostępne noclegi dla monterów DSK-UG w Lipsku. Różne typy pokoi i udogodnienia dla każdej potrzeby.',
      keywords: 'noclegi monterów Lipsk, rezerwacja pokoi, zakwaterowanie Lipsk, wybór pokoi monterskich'
    },
    ro: {
      title: 'Cazare - DSK-UG Leipzig | Toate Cazările pentru Muncitori',
      description: 'Descoperă toate cazările disponibile pentru muncitori DSK-UG în Leipzig. Diferite tipuri de camere și facilități pentru fiecare nevoie.',
      keywords: 'cazare muncitori Leipzig, rezervare camere, cazare Leipzig, selecție camere muncitori'
    }
  },
  booking: {
    de: {
      title: 'Buchung - DSK-UG Leipzig | Monteurunterkunft online buchen',
      description: 'Buchen Sie Ihre Monteurunterkunft in Leipzig schnell und einfach online. Sichere Buchung mit sofortiger Bestätigung.',
      keywords: 'Monteurunterkunft buchen Leipzig, online Buchung, Zimmer reservieren Leipzig'
    },
    en: {
      title: 'Booking - DSK-UG Leipzig | Book Worker Accommodation Online',
      description: 'Book your worker accommodation in Leipzig quickly and easily online. Secure booking with instant confirmation.',
      keywords: 'book worker accommodation Leipzig, online booking, reserve room Leipzig'
    },
    pl: {
      title: 'Rezerwacja - DSK-UG Lipsk | Zarezerwuj Nocleg dla Monterów Online',
      description: 'Zarezerwuj swój nocleg dla monterów w Lipsku szybko i łatwo online. Bezpieczna rezerwacja z natychmiastowym potwierdzeniem.',
      keywords: 'rezerwacja noclegu monterów Lipsk, rezerwacja online, rezerwacja pokoju Lipsk'
    },
    ro: {
      title: 'Rezervare - DSK-UG Leipzig | Rezervă Cazare pentru Muncitori Online',
      description: 'Rezervă cazarea pentru muncitori în Leipzig rapid și ușor online. Rezervare sigură cu confirmare instantanee.',
      keywords: 'rezervare cazare muncitori Leipzig, rezervare online, rezervare cameră Leipzig'
    }
  },
  contact: {
    de: {
      title: 'Kontakt - DSK-UG Leipzig | Kontaktieren Sie uns',
      description: 'Kontaktieren Sie DSK-UG für Fragen zu Monteurunterkünften in Leipzig. Telefon, E-Mail und Anfahrt.',
      keywords: 'DSK-UG Kontakt, Monteurunterkünfte Leipzig Kontakt, Telefon, E-Mail'
    },
    en: {
      title: 'Contact - DSK-UG Leipzig | Get in Touch',
      description: 'Contact DSK-UG for questions about worker accommodations in Leipzig. Phone, email and directions.',
      keywords: 'DSK-UG contact, worker accommodations Leipzig contact, phone, email'
    },
    pl: {
      title: 'Kontakt - DSK-UG Lipsk | Skontaktuj się z nami',
      description: 'Skontaktuj się z DSK-UG w sprawie noclegów dla monterów w Lipsku. Telefon, e-mail i dojazd.',
      keywords: 'DSK-UG kontakt, noclegi monterów Lipsk kontakt, telefon, e-mail'
    },
    ro: {
      title: 'Contact - DSK-UG Leipzig | Contactează-ne',
      description: 'Contactează DSK-UG pentru întrebări despre cazarea muncitorilor în Leipzig. Telefon, email și direcții.',
      keywords: 'DSK-UG contact, cazare muncitori Leipzig contact, telefon, email'
    }
  }
}