import express from 'express'

const router = express.Router()

// In-Memory Cache & Performance Stats
const cache = { geocode: new Map(), pois: new Map() }
const perf = { total: 0, success: 0, fail: 0, avgMs: 0 }
const TTL_MS = 10 * 60 * 1000

function getCache(map, key) {
  const it = map.get(key)
  return it && (Date.now() - it.ts < TTL_MS) ? it.value : null
}
function setCache(map, key, value) { map.set(key, { value, ts: Date.now() }) }

// Helpers
async function geocodeAddress(fullAddress) {
  const key = `geo:${fullAddress}`
  const hit = getCache(cache.geocode, key)
  if (hit) return hit
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(fullAddress)}`
  const t0 = Date.now()
  const resp = await fetch(url, { headers: { 'User-Agent': 'DSK-UG/1.0' } })
  const dt = Date.now() - t0
  if (!resp.ok) throw new Error(`Geocoding fehlgeschlagen (${resp.status}) in ${dt}ms`)
  const arr = await resp.json()
  if (!arr?.length) throw new Error('Adresse nicht gefunden')
  const value = { lat: Number(arr[0].lat), lon: Number(arr[0].lon), display_name: arr[0].display_name }
  setCache(cache.geocode, key, value)
  return value
}

function buildUnifiedOverpassQuery(lat, lon, radiusM) {
  return `[out:json][timeout:60];
(
  node["shop"~"supermarket|convenience|department_store|mall|chemist"](around:${radiusM},${lat},${lon});
  way["shop"~"supermarket|convenience|department_store|mall|chemist"](around:${radiusM},${lat},${lon});

  node["amenity"~"restaurant|cafe|fast_food|bar|pub|marketplace|pharmacy|hospital|bank|post_office|fuel|doctors|clinic"](around:${radiusM},${lat},${lon});
  way["amenity"~"restaurant|cafe|fast_food|bar|pub|marketplace|pharmacy|hospital|bank|post_office|clinic"](around:${radiusM},${lat},${lon});

  node["highway"="bus_stop"](around:${radiusM},${lat},${lon});

  node["railway"~"station|stop|halt|tram_stop"](around:${radiusM},${lat},${lon});
  way["railway"~"station|stop|halt"](around:${radiusM},${lat},${lon});

  node["public_transport"~"stop_position|platform|station"](around:${radiusM},${lat},${lon});
  way["public_transport"~"platform|station"](around:${radiusM},${lat},${lon});

  node["healthcare"~"doctor|hospital|clinic|dentist"](around:${radiusM},${lat},${lon});
  way["healthcare"~"doctor|hospital|clinic|dentist"](around:${radiusM},${lat},${lon});

  node["leisure"~"park|playground|fitness_centre|sports_centre|garden"](around:${radiusM},${lat},${lon});
  way["leisure"~"park|playground|fitness_centre|sports_centre|garden"](around:${radiusM},${lat},${lon});

  node["tourism"="attraction"](around:${radiusM},${lat},${lon});
  way["tourism"="attraction"](around:${radiusM},${lat},${lon});
);
out center;`
}

async function overpassUnified(lat, lon, radiusM) {
  const key = `pois:${lat.toFixed(6)}:${lon.toFixed(6)}:${radiusM}`
  const cached = getCache(cache.pois, key)
  if (cached) return { elements: cached, cached: true, ms: 0 }

  const data = buildUnifiedOverpassQuery(lat, lon, radiusM)
  const urls = [ 'https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter' ]
  let lastErr = null
  const t0 = Date.now()
  for (const u of urls) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      const resp = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ data }), signal: controller.signal })
      clearTimeout(timeoutId)
      if (resp.ok) {
        const json = await resp.json()
        const elements = json.elements || []
        const ms = Date.now() - t0
        perf.total++; perf.success++; perf.avgMs = perf.avgMs ? Math.round((perf.avgMs * (perf.success - 1) + ms) / perf.success) : ms
        setCache(cache.pois, key, elements)
        console.log(`✅ Overpass OK (${u}) in ${ms}ms, Elemente=${elements.length}, avgMs=${perf.avgMs}`)
        return { elements, cached: false, ms }
      }
      lastErr = new Error(`Overpass Fehler (${resp.status})`)
      console.warn(`⚠️ Overpass Status ${resp.status} bei ${u}`)
    } catch (e) {
      lastErr = e
      console.warn(`⚠️ Overpass Fehler ${u}: ${e.message}`)
    }
  }
  const ms = Date.now() - t0
  perf.total++; perf.fail++
  console.error(`❌ Overpass fehlgeschlagen in ${ms}ms`)
  throw lastErr || new Error('Overpass unbekannter Fehler')
}

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (v) => v * Math.PI / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function normalizeEntry(e, origin) {
  const lat = e.center?.lat ?? e.lat
  const lon = e.center?.lon ?? e.lon
  const name = e.tags?.name || e.tags?.brand || e.tags?.operator || 'Unbenannt'
  const street = e.tags?.['addr:street'] || ''
  const housenr = e.tags?.['addr:housenumber'] || ''
  const postcode = e.tags?.['addr:postcode'] || ''
  const city = e.tags?.['addr:city'] || ''
  return {
    name,
    typ: Object.entries(e.tags || {})
      .filter(([k]) => ['amenity','shop','railway','highway','leisure','healthcare','public_transport','tourism'].includes(k))
      .map(([k,v]) => `${k}:${v}`)
      .join(', '),
    entfernung_m: haversine(origin.lat, origin.lon, lat, lon),
    adresse: [street, housenr].filter(Boolean).join(' ') + (postcode || city ? `, ${[postcode, city].filter(Boolean).join(' ')}` : ''),
  }
}

router.post('/connectivity', async (req, res) => {
  const { address = '', postal_code = '', city = '', location = '' } = req.body || {}
  try {
    const fullAddress = [address, postal_code, city || 'Leipzig'].filter(Boolean).join(', ')
    console.log('🏠 Connectivity Request:', fullAddress)
    const tTotal = Date.now()
    const origin = await geocodeAddress(fullAddress)
    const radius = 1200
    const { elements, cached, ms } = await overpassUnified(origin.lat, origin.lon, radius)

    const cats = { einkauf: [], gastronomie: [], oepnv: [], medizin: [], parks: [], weitere: [] }
    elements.forEach(e => {
      const t = e.tags || {}
      const entry = normalizeEntry(e, origin)
      if (t.shop && ['supermarket','department_store','mall','chemist','convenience'].includes(t.shop)) cats.einkauf.push(entry)
      else if (t.amenity && ['marketplace'].includes(t.amenity)) cats.einkauf.push(entry)
      else if (t.amenity && ['restaurant','cafe','fast_food','bar','pub'].includes(t.amenity)) cats.gastronomie.push(entry)
      else if ((t.highway && t.highway === 'bus_stop') || (t.railway && ['station','stop','halt','tram_stop'].includes(t.railway)) || (t.public_transport && ['stop_position','platform','station'].includes(t.public_transport))) cats.oepnv.push(entry)
      else if ((t.healthcare && ['doctor','hospital','clinic','dentist'].includes(t.healthcare)) || (t.amenity && ['pharmacy','hospital','doctors','clinic'].includes(t.amenity))) cats.medizin.push(entry)
      else if (t.leisure && ['park','playground','fitness_centre','sports_centre','garden'].includes(t.leisure)) cats.parks.push(entry)
      else if (t.amenity && ['bank','post_office','fuel','atm'].includes(t.amenity)) cats.weitere.push(entry)
      else if (t.tourism && t.tourism === 'attraction') cats.weitere.push(entry)
    })

    const sortByDist = (a,b) => a.entfernung_m - b.entfernung_m
    Object.keys(cats).forEach(k => cats[k] = cats[k].sort(sortByDist).slice(0, 10))

    const payload = {
      adresse: fullAddress,
      koordinaten: { lat: origin.lat, lon: origin.lon },
      radius_m: radius,
      kategorien: cats,
      zusammenfassung: `Standortanalyse für ${location || city || 'Leipzig'} im Umkreis von ${(radius/1000).toFixed(1)} km.`,
      qualitaetspruefung: { plausibel: elements.length > 0, datenquellen: ['OpenStreetMap/Overpass'] },
      metrics: { overpass_ms: ms, cached, total_ms: Date.now() - tTotal, avg_ms: perf.avgMs, success: perf.success, fail: perf.fail }
    }

    // Optional: DeepSeek strukturierte Ausgabe basierend auf verifizierten Daten
    let text = ''
    try {
      const apiKey = process.env.DEEPSEEK_API_KEY
      if (apiKey && elements.length) {
        const system = 'Du bist ein Experte für Standortbeschreibungen. Antworte ausschließlich auf Deutsch. Erstelle eine kundenfreundliche, zusammenfassende Beschreibung der Anbindung und Infrastruktur (max. 500 Zeichen). Verwende NUR die gelieferten Daten; keine erfundenen Orte.'
        const user = { 
          aufgabe: 'Erstelle eine kundenfreundliche Zusammenfassung der Anbindung für die Webseite', 
          adresse: payload.adresse, 
          radius_m: payload.radius_m, 
          kategorien: payload.kategorien, 
          anweisung: `Erstelle einen fließenden Text (2-3 Sätze), der die wichtigsten Infrastruktur-Punkte zusammenfasst. Erwähne:
- ÖPNV-Anbindung (nächste Haltestellen/Bahnhöfe mit Entfernung)
- Einkaufsmöglichkeiten in der Nähe
- Gastronomie-Angebot wenn vorhanden

Beispiel: "Die Unterkunft liegt verkehrsgünstig mit der Straßenbahnhaltestelle Hauptbahnhof (200m) und dem S-Bahnhof Messe (350m) in unmittelbarer Nähe. Einkaufsmöglichkeiten wie REWE (150m) und Edeka (280m) sind fußläufig erreichbar. Diverse Restaurants und Cafés befinden sich im Umkreis von 300m."

Schreibe professionell, sachlich und kundenorientiert. Keine Aufzählungen, nur Fließtext.` 
        }
        const resp = await fetch('https://api.deepseek.com/v1/chat/completions', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, 
          body: JSON.stringify({ 
            model: 'deepseek-chat', 
            messages: [ 
              { role: 'system', content: system }, 
              { role: 'user', content: JSON.stringify(user) } 
            ], 
            temperature: 0.5, 
            max_tokens: 400 
          }) 
        })
        if (resp.ok) { const js = await resp.json(); text = js?.choices?.[0]?.message?.content || '' }
      }
    } catch (e) { console.warn('⚠️ DeepSeek Fehler:', e.message) }
    text = (text || '').trim()
    // Clean up text
    text = text.replace(/^["']|["']$/g, '').replace(/\n\n+/g, ' ')
    if (text.length > 1000) text = text.slice(0, 1000)
    return res.json({ success: true, data: { ...payload, text } })
  } catch (err) {
    perf.total++; perf.fail++
    console.error('❌ Connectivity Fehler:', err.message)
    return res.status(200).json({ success: true, data: { adresse: [address, postal_code, city].filter(Boolean).join(', '), koordinaten: { lat: 0, lon: 0 }, radius_m: 1200, kategorien: { einkauf: [], gastronomie: [], oepnv: [], medizin: [], parks: [], weitere: [] }, zusammenfassung: 'Analyse nicht möglich (Geocoding/POI)', qualitaetspruefung: { plausibel: false, fehler: err.message }, metrics: { avg_ms: perf.avgMs, success: perf.success, fail: perf.fail } } })
  }
})

// Generate accommodation name based on details
router.post('/generate-name', async (req, res) => {
  const { property_type, floor, square_meters, bedrooms, bathrooms, max_guests, amenities, location, postal_code, has_living_room, has_terrace } = req.body || {}
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return res.json({ success: false, error: 'API-Schlüssel nicht konfiguriert' })
    }

    const propertyTypeDE = {
      'apartment': 'Wohnung',
      'private_room': 'Privatzimmer',
      'guesthouse': 'Pension',
      'house': 'Haus',
      'studio': 'Studio'
    }

    const system = 'Du bist ein Experte für kreative und ansprechende Namen für Monteurunterkünfte in Deutschland. Antworte ausschließlich auf Deutsch. Erstelle 3 verschiedene, einprägsame Namen (max. 35 Zeichen pro Name). Die Namen sollen professionell, einladend und für Monteure ansprechend sein.'
    
    const amenitiesText = Array.isArray(amenities) && amenities.length > 0 
      ? amenities.map(a => {
          const map = { wifi: 'WLAN', kitchen: 'Küche', parking: 'Parkplatz', bathroom: 'Bad', tv: 'TV', laundry: 'Waschmaschine', balcony: 'Balkon' }
          return map[a] || a
        }).join(', ')
      : 'Standard-Ausstattung'

    const user = {
      aufgabe: 'Generiere 3 professionelle Namen für eine Monteurunterkunft',
      unterkunft: {
        typ: propertyTypeDE[property_type] || 'Wohnung',
        etage: floor ? `${floor}. ${floor === 0 ? 'EG' : 'OG'}` : 'nicht angegeben',
        groesse: square_meters ? `${square_meters}m²` : 'nicht angegeben',
        schlafzimmer: bedrooms || 'nicht angegeben',
        badezimmer: bathrooms || 'nicht angegeben',
        max_gaeste: max_guests || 'mehrere',
        ausstattung: amenitiesText,
        lage: location || 'Leipzig',
        plz: postal_code || '',
        wohnzimmer: has_living_room ? 'ja' : 'nein',
        terrasse_balkon: has_terrace ? 'ja' : 'nein'
      },
      beispiele: [
        'Monteurzimmer Zentrum Leipzig',
        'Apartment am Hauptbahnhof',
        'Komfort-Wohnung Gohlis',
        'City-Apartment für Monteure'
      ],
      anweisung: 'Erstelle 3 verschiedene Namen. Jeder Name sollte: 1) Den Unterkunftstyp oder die Lage erwähnen, 2) Professionell und einladend klingen, 3) Für Monteure/Handwerker ansprechend sein. Gib NUR die 3 Namen zurück, jeweils in einer neuen Zeile, ohne Nummerierung oder zusätzlichen Text.'
    }

    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) }
        ],
        temperature: 0.8,
        max_tokens: 200
      })
    })

    if (!resp.ok) {
      throw new Error(`DeepSeek API Fehler: ${resp.status}`)
    }

    const js = await resp.json()
    const content = js?.choices?.[0]?.message?.content || ''
    
    // Parse suggestions
    let suggestions = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.includes('```') && line.length > 5 && line.length < 50)
      .slice(0, 3)

    if (suggestions.length === 0) {
      suggestions = ['Monteurunterkunft ' + (location || 'Leipzig')]
    }

    return res.json({ success: true, suggestions })
  } catch (err) {
    console.error('❌ Name Generation Fehler:', err.message)
    return res.json({ success: false, error: 'Fehler bei der Namens-Generierung' })
  }
})

// Generate "About" description based on all accommodation details
router.post('/generate-about', async (req, res) => {
  const { name, property_type, floor, square_meters, bedrooms, bathrooms, max_guests, amenities, location, address, postal_code, details, connectivity, has_living_room, has_terrace, images } = req.body || {}
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return res.json({ success: false, error: 'API-Schlüssel nicht konfiguriert' })
    }

    const propertyTypeDE = {
      'apartment': 'Wohnung',
      'private_room': 'Privatzimmer',
      'guesthouse': 'Pension',
      'house': 'Haus',
      'studio': 'Studio'
    }

    const amenitiesText = Array.isArray(amenities) && amenities.length > 0 
      ? amenities.map(a => {
          const map = { wifi: 'WLAN', kitchen: 'Küche', parking: 'Parkplatz', bathroom: 'Bad', tv: 'TV', laundry: 'Waschmaschine', balcony: 'Balkon' }
          return map[a] || a
        }).join(', ')
      : 'Standard-Ausstattung'

    const system = 'Du bist ein Experte für ansprechende Unterkunftsbeschreibungen. Antworte ausschließlich auf Deutsch. Erstelle eine professionelle, einladende Beschreibung (200-350 Wörter) für eine Monteurunterkunft, die auf einer Webseite für Kunden angezeigt wird.'
    
    const user = {
      aufgabe: 'Erstelle eine "Über diese Unterkunft" Beschreibung für die Webseite',
      unterkunft: {
        name: name || 'Monteurunterkunft',
        typ: propertyTypeDE[property_type] || 'Wohnung',
        etage: floor !== null && floor !== undefined ? `${floor}. ${floor === 0 ? 'Erdgeschoss' : 'Obergeschoss'}` : null,
        groesse: square_meters ? `${square_meters}m²` : null,
        schlafzimmer: bedrooms || null,
        badezimmer: bathrooms || null,
        max_gaeste: max_guests || 'mehrere Personen',
        ausstattung: amenitiesText,
        lage: location || 'Leipzig',
        adresse: address || '',
        plz: postal_code || '',
        wohnzimmer: has_living_room,
        terrasse_balkon: has_terrace,
        interne_details: details || '',
        anbindung: connectivity || '',
        anzahl_bilder: Array.isArray(images) ? images.length : 0
      },
      zielgruppe: 'Monteure, Handwerker, Geschäftsreisende',
      ton: 'Professionell, einladend, sachlich, vertrauenswürdig',
      anweisung: `Erstelle eine ansprechende Beschreibung, die:
1) Die Unterkunft einladend vorstellt
2) Die wichtigsten Merkmale hervorhebt (Größe, Ausstattung, Lage)
3) Die Vorteile für Monteure betont (z.B. gute Anbindung, Parkplatz, WLAN, Küche)
4) Einen professionellen, aber freundlichen Ton verwendet
5) Keine Übertreibungen oder erfundene Details enthält
6) 200-350 Wörter lang ist

Struktur:
- Einleitung: Kurze Vorstellung der Unterkunft
- Hauptteil: Ausstattung, Räume, Besonderheiten
- Abschluss: Zusammenfassung der Vorteile

Schreibe fließend und natürlich, ohne Aufzählungen.`
    }

    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) }
        ],
        temperature: 0.7,
        max_tokens: 900
      })
    })

    if (!resp.ok) {
      throw new Error(`DeepSeek API Fehler: ${resp.status}`)
    }

    const js = await resp.json()
    let description = js?.choices?.[0]?.message?.content || ''
    
    // Clean up the description
    description = description.trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/\n\n+/g, '\n\n') // Normalize line breaks

    if (description.length < 50) {
      return res.json({ success: false, error: 'Generierte Beschreibung zu kurz' })
    }

    return res.json({ success: true, description })
  } catch (err) {
    console.error('❌ About Generation Fehler:', err.message)
    return res.json({ success: false, error: 'Fehler bei der Beschreibungs-Generierung' })
  }
})

// Analyze images and generate description (simplified - actual image analysis would require vision model)
router.post('/analyze-images', async (req, res) => {
  const { images, name, amenities } = req.body || {}
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return res.json({ success: false, error: 'API-Schlüssel nicht konfiguriert' })
    }

    // Note: DeepSeek doesn't have vision capabilities, so we'll generate based on metadata
    const system = 'Du bist ein Experte für Unterkunftsbeschreibungen. Antworte ausschließlich auf Deutsch. Erstelle eine ansprechende Beschreibung basierend auf den Bildtiteln und der Ausstattung.'
    const user = {
      aufgabe: 'Erstelle eine Beschreibung basierend auf Bildinformationen',
      unterkunft_name: name || 'Monteurunterkunft',
      anzahl_bilder: Array.isArray(images) ? images.length : 0,
      bild_titel: Array.isArray(images) ? images.map(img => img.title || img.filename).filter(Boolean) : [],
      ausstattung: Array.isArray(amenities) ? amenities.join(', ') : 'Standard',
      anweisung: 'Erstelle eine kurze, ansprechende Beschreibung (100-200 Wörter) die die visuellen Aspekte der Unterkunft hervorhebt.'
    }

    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) }
        ],
        temperature: 0.6,
        max_tokens: 500
      })
    })

    if (!resp.ok) {
      throw new Error(`DeepSeek API Fehler: ${resp.status}`)
    }

    const js = await resp.json()
    const analysis = js?.choices?.[0]?.message?.content || ''

    return res.json({ success: true, analysis: analysis.trim() })
  } catch (err) {
    console.error('❌ Image Analysis Fehler:', err.message)
    return res.json({ success: false, error: err.message })
  }
})


export default router
