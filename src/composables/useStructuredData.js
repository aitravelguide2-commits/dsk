export function useStructuredData() {
  
  const addStructuredData = (data) => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }
    
    // Add new structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }
  
  return {
    addStructuredData
  }
}

// Structured data templates
export const structuredDataTemplates = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DSK-UG",
    "description": "Hochwertige Monteurunterkünfte in Leipzig für Handwerker und Geschäftsreisende",
    "url": "https://dsk-ug.de",
    "logo": "https://dsk-ug.de/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+49-151-71421923",
      "contactType": "customer service",
      "availableLanguage": ["German", "English", "Polish", "Romanian", "Russian", "Ukrainian"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Leipzig",
      "postalCode": "04109",
      "addressCountry": "DE"
    },
    "sameAs": [
      "https://www.facebook.com/dsk-ug",
      "https://www.instagram.com/dsk-ug"
    ]
  },
  
  lodgingBusiness: {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "DSK-UG Monteurunterkünfte Leipzig",
    "description": "Komfortable und günstige Monteurunterkünfte in Leipzig mit moderner Ausstattung",
    "url": "https://dsk-ug.de",
    "telephone": "+49-151-71421923",
    "email": "info@dsk-ug.de",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Leipzig",
      "postalCode": "04109",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.3397,
      "longitude": 12.3731
    },
    "priceRange": "€45-€120",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free WiFi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Kitchen",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parking",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Laundry",
        "value": true
      }
    ],
    "checkinTime": "15:00",
    "checkoutTime": "11:00",
    "petsAllowed": false,
    "smokingAllowed": false
  },
  
  breadcrumbList: (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),
  
  accommodation: (accommodation) => ({
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": accommodation.name,
    "description": accommodation.description,
    "image": accommodation.image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Leipzig",
      "addressCountry": "DE"
    },
    "amenityFeature": accommodation.features.map(feature => ({
      "@type": "LocationFeatureSpecification",
      "name": feature,
      "value": true
    })),
    "occupancy": {
      "@type": "QuantitativeValue",
      "maxValue": accommodation.capacity
    },
    "priceRange": `€${accommodation.price}`,
    "offers": {
      "@type": "Offer",
      "price": accommodation.price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  }),
  
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DSK-UG Monteurunterkünfte Leipzig",
    "url": "https://dsk-ug.de",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dsk-ug.de/unterkuenfte?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  
  localBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "DSK-UG",
    "description": "Monteurunterkünfte und Arbeiterunterkünfte in Leipzig",
    "url": "https://dsk-ug.de",
    "telephone": "+49-151-71421923",
    "email": "info@dsk-ug.de",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Leipzig",
      "postalCode": "04109",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.3397,
      "longitude": 12.3731
    },
    "openingHours": "Mo-Su 00:00-24:00",
    "priceRange": "€45-€120",
    "servedCuisine": [],
    "hasMap": "https://maps.google.com/?q=Leipzig+Musterstraße+123"
  }
}