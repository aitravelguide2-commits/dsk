import express from 'express'

const router = express.Router()

// Overpass helpers
async function geocodeAddress(fullAddress) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(fullAddress)}`
  const resp = await fetch(url, { headers: { 'User-Agent': 'DSK-UG/1.0' } })
  if (!resp.ok) throw new Error(`Geocoding fehlgeschlagen (${resp.status})`)
  const arr = await resp.json()
  if (!arr?.length) throw new Error('Adresse nicht gefunden')
  return { lat: Number(arr[0].lat), lon: Number(arr[0].lon), display_name: arr[0].display_name }
}

async function overpassAround(lat, lon, radiusM) {
  // OPTIMIERT: Eine einzelne Abfrage statt 23 einzelne!
  const data = `[out:json][timeout:25];
(
  node["shop"~"supermarket|convenience|department_store|mall|chemist"](around:${radiusM},${lat},${lon});
  way["shop"~"supermarket|convenience|department_store|mall|chemist"](around:${radiusM},${lat},${lon});
  
  node["amenity"~"restaurant|cafe|fast_food|bar|pub|marketplace|pharmacy|hospital|bank|post_office|fuel"](around:${radiusM},${lat},${lon});
  way["amenity"~"restaurant|cafe|fast_food|bar|pub|marketplace|pharmacy|hospital|bank|post_office"](around:${radiusM},${lat},${lon});
  
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

  console.log('🔎 Overpass Query gestartet für', lat, lon, 'Radius', radiusM, 'm')
  
  const urls = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
  ]
  
  let lastErr = null
  for (const u of urls) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20s timeout
      
      const resp = await fetch(u, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ data }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (resp.ok) {
        const json = await resp.json()
        const elements = json.elements || []
        console.log(`✅ Overpass erfolgreich: ${elements.length} POIs gefunden`)
        
        // Debug: Zeige erste 3 POIs
        if (elements.length > 0) {
          console.log('📍 Beispiel POIs:', elements.slice(0, 3).map(e => ({
            name: e.tags?.name || 'unnamed',
            type: e.tags?.amenity || e.tags?.shop || e.tags?.railway || 'other'
          })))
        } else {
          console.warn('⚠️ Keine POIs gefunden! Koordinaten:', lat, lon)
        }
        
        return elements
      }
      lastErr = new Error(`Overpass Fehler (${resp.status})`)
      console.warn(`⚠️ Overpass Server ${u}: Status ${resp.status}`)
    } catch (e) {
      if (e.name === 'AbortError') {
        console.warn(`⏱️ Timeout bei ${u}`)
        lastErr = new Error('Overpass Timeout')
      } else {
        console.warn(`❌ Overpass Fehler ${u}:`, e.message)
        lastErr = e
      }
    }
  }
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
    adresse: [street, housenr].filter(Boolean).join(' ') + 
             (postcode || city ? `, ${[postcode, city].filter(Boolean).join(' ')}` : ''),
  }
}

router.post('/connectivity', async (req, res) => {
  const { address = '', postal_code = '', city = '', location = '' } = req.body || {}
  
  console.log('🏠 Connectivity Request:', { address, postal_code, city, location })
  
  try {
    const fullAddress = [address, postal_code, city || 'Leipzig'].filter(Boolean).join(', ')
    console.log('🔍 Geocoding Adresse:', fullAddress)
    
    const origin = await geocodeAddress(fullAddress)
    console.log('📍 Koordinaten gefunden:', origin.lat, origin.lon)
    console.log('   Display Name:', origin.display_name)
    
    const radius = 1200
    const elements = await overpassAround(origin.lat, origin.lon, radius)

    if (elements.length === 0) {
      console.warn('⚠️ KEINE POIs gefunden! Mögliche Ursachen:')
      console.warn('   - Overpass API überlastet')
      console.warn('   - Koordinaten außerhalb von OSM-Daten')
      console.warn('   - Netzwerkprobleme')
    }

    const cats = { 
      einkauf: [], 
      gastronomie: [], 
      oepnv: [], 
      medizin: [], 
      parks: [], 
      weitere: [] 
    }
    
    elements.forEach(e => {
      const t = e.tags || {}
      const entry = normalizeEntry(e, origin)
      
      // Einkauf
      if (t.shop && ['supermarket','department_store','mall','chemist','convenience'].includes(t.shop)) {
        cats.einkauf.push(entry)
      } else if (t.amenity && ['marketplace'].includes(t.amenity)) {
        cats.einkauf.push(entry)
      }
      // Gastronomie
      else if (t.amenity && ['restaurant','cafe','fast_food','bar','pub'].includes(t.amenity)) {
        cats.gastronomie.push(entry)
      }
      // ÖPNV
      else if (
        (t.highway && t.highway === 'bus_stop') || 
        (t.railway && ['station','stop','halt','tram_stop'].includes(t.railway)) || 
        (t.public_transport && ['stop_position','platform','station'].includes(t.public_transport))
      ) {
        cats.oepnv.push(entry)
      }
      // Medizin
      else if (
        (t.healthcare && ['doctor','hospital','clinic','dentist'].includes(t.healthcare)) || 
        (t.amenity && ['pharmacy','hospital'].includes(t.amenity))
      ) {
        cats.medizin.push(entry)
      }
      // Parks
      else if (t.leisure && ['park','playground','fitness_centre','sports_centre','garden'].includes(t.leisure)) {
        cats.parks.push(entry)
      }
      // Weitere
      else if (t.amenity && ['bank','post_office','fuel'].includes(t.amenity)) {
        cats.weitere.push(entry)
      } else if (t.tourism && t.tourism === 'attraction') {
        cats.weitere.push(entry)
      }
    })

    const sortByDist = (a,b) => a.entfernung_m - b.entfernung_m
    Object.keys(cats).forEach(k => {
      cats[k] = cats[k].sort(sortByDist).slice(0, 10)
      console.log(`📊 ${k}: ${cats[k].length} Einträge`)
    })

    const payload = {
      adresse: fullAddress,
      koordinaten: { lat: origin.lat, lon: origin.lon },
      radius_m: radius,
      kategorien: cats,
      zusammenfassung: `Standortanalyse für ${location || city || 'Leipzig'} im Umkreis von ${(radius/1000).toFixed(1)} km.`,
      qualitaetspruefung: { 
        plausibel: elements.length > 0, 
        datenquellen: ['OpenStreetMap/Overpass'], 
        erstellt_am: new Date().toISOString(),
        gesamt_pois: elements.length
      }
    }
    
    // DeepSeek strukturierte Ausgabe
    let text = ''
    try {
      const apiKey = process.env.DEEPSEEK_API_KEY
      if (apiKey) {
        console.log('🤖 DeepSeek Anfrage starten...')
        
        const system = 'Antwort ausschließlich auf Deutsch. Verwende NUR die gelieferten Daten. Keine erfundenen Orte. Formatiere übersichtlich.'
        const user = {
          aufgabe: 'Standortanalyse strukturieren',
          adresse: payload.adresse,
          radius_m: payload.radius_m,
          kategorien: payload.kategorien,
          anweisung: 'Erstelle eine übersichtliche Standortanalyse. Gliedere nach: **Einkauf**, **Gastronomie**, **ÖPNV**, **Medizinische Versorgung**, **Parks & Freizeit**, **Weitere Einrichtungen**. Pro Kategorie: liste die nächsten Orte mit Name und Entfernung in Metern auf. Wenn eine Kategorie leer ist, schreibe "Keine Einträge im Umkreis von 1,2 km gefunden". Sei prägnant und nutzerfreundlich. Maximal 5 Einträge pro Kategorie.'
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
            temperature: 0.1, 
            max_tokens: 1200
          })
        })
        
        if (resp.ok) {
          const js = await resp.json()
          text = js?.choices?.[0]?.message?.content || ''
          console.log('✅ DeepSeek Antwort:', text.substring(0, 100) + '...')
        } else {
          console.warn('⚠️ DeepSeek API Fehler:', resp.status, await resp.text())
        }
      } else {
        console.warn('⚠️ DEEPSEEK_API_KEY nicht gesetzt!')
      }
    } catch (e) { 
      console.error('❌ DeepSeek Fehler:', e.message)
    }
    
    console.log('✅ Response wird gesendet')
    return res.json({ success: true, data: { ...payload, text } })
    
  } catch (err) {
    console.error('❌ Connectivity Fehler:', err.message)
    console.error('   Stack:', err.stack)
    
    return res.status(200).json({ 
      success: true, 
      data: {
        adresse: [address, postal_code, city].filter(Boolean).join(', '),
        koordinaten: { lat: 0, lon: 0 },
        radius_m: 1200,
        kategorien: { einkauf: [], gastronomie: [], oepnv: [], medizin: [], parks: [], weitere: [] },
        zusammenfassung: 'Analyse nicht möglich (Geocoding/POI-Abfrage fehlgeschlagen)',
        qualitaetspruefung: { 
          plausibel: false, 
          fehler: err.message,
          erstellt_am: new Date().toISOString()
        }
      } 
    })
  }
})

export default router