<template>
  <q-page class="modern-edit-page">
    <q-banner v-if="store.demo" rounded class="warning-banner q-mb-md">
      <template #avatar><q-icon name="info" color="warning"/></template>
      Demodaten werden angezeigt (Backend nicht verbunden).
    </q-banner>
    <q-banner v-else-if="store.error" rounded class="warning-banner q-mb-md">
      <template #avatar><q-icon name="warning" color="warning"/></template>
      Speichern/Bearbeiten möglicherweise nicht möglich: keine Backend-Verbindung.
    </q-banner>

    <div class="page-header">
      <h1 class="page-title">{{ route.params.id === 'new' ? 'Neue Unterkunft' : 'Unterkunft bearbeiten' }}</h1>
      <q-btn 
        label="Speichern" 
        icon="save"
        color="primary" 
        @click="save"
        unelevated
        class="save-btn"
      />
    </div>

    <q-form @submit.prevent="save" class="edit-form">
      <!-- Basisdaten Card -->
      <q-card class="form-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="info" size="24px" />
            <span>Basisdaten</span>
          </div>
        </q-card-section>
        <q-card-section>
          <!-- Name mit KI -->
          <div class="ai-field-group">
            <q-input 
              v-model="acc.name" 
              label="Name der Unterkunft *" 
              :rules="[v => !!v || 'Name ist erforderlich']" 
              outlined 
              class="field-input"
            />
            <q-btn 
              icon="psychology" 
              label="KI-Vorschläge" 
              @click="generateName"
              :loading="aiLoading.name"
              outline
              color="blue-7"
              class="ai-action-btn"
            >
              <q-tooltip>Namen mit KI generieren</q-tooltip>
            </q-btn>
          </div>

          <!-- Preis & Gäste -->
          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-12 col-md-4">
              <q-input 
                v-model.number="acc.price_per_night" 
                type="number" 
                step="0.01" 
                label="Preis pro Nacht (€) *" 
                outlined 
                prefix="€"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input 
                v-model.number="acc.max_guests" 
                type="number" 
                label="Max. Anzahl Gäste *" 
                outlined 
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input 
                v-model.number="acc.min_stay_nights" 
                type="number" 
                min="1" 
                label="Mindestaufenthalt (Nächte)" 
                outlined 
              />
            </div>
          </div>

          <!-- Preisverwaltung (nach oben verschoben) -->
          <div class="q-mt-md">
            <div class="subsection-title">Preisverwaltung</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input 
                  v-model.number="price.extra_costs.cleaningFee" 
                  type="number" 
                  step="0.01" 
                  label="Reinigungsgebühr (€)" 
                  outlined 
                  prefix="€"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input 
                  v-model.number="price.extra_costs.cleaningFeeThreshold" 
                  type="number" 
                  label="Ab wie vielen Nächten?" 
                  outlined 
                  hint="Reinigungsgebühr wird ab dieser Anzahl Nächte berechnet"
                />
              </div>
            </div>
            <div class="price-preview q-mt-sm">
              <q-icon name="info_outline" size="18px" />
              <span>{{ pricePreviewText }}</span>
            </div>
            <q-btn 
              color="primary" 
              :disable="!acc.id" 
              label="Preise speichern" 
              @click="savePrice"
              outline
              class="q-mt-sm"
            />
          </div>

          <!-- Adresse -->
          <div class="q-mt-md">
            <div class="subsection-title">Adresse</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input 
                  v-model="acc.address" 
                  label="Straße & Hausnummer" 
                  outlined 
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model="acc.postal_code"
                  label="PLZ"
                  mask="#####"
                  outlined
                  :error="postalError"
                  error-message="PLZ nicht in Leipzig/Chemnitz"
                  @update:model-value="onPostalCodeChange"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input 
                  v-model="acc.location" 
                  label="Bezirk/Stadtteil" 
                  :hint="districtHint" 
                  outlined 
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Zusätzliche Details für KI (nicht im Frontend sichtbar) -->
      <q-card class="form-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="tune" size="24px" />
            <span>Zusätzliche Details (für KI-Generierung)</span>
          </div>
          <q-chip size="sm" color="blue-1" text-color="blue-9">
            <q-icon name="info" size="16px" class="q-mr-xs" />
            Diese Felder werden nur für die KI-Generierung verwendet
          </q-chip>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select 
                v-model="acc.property_type" 
                :options="propertyTypeOptions" 
                label="Unterkunftstyp" 
                outlined 
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input 
                v-model.number="acc.floor" 
                type="number" 
                label="Etage" 
                outlined 
                hint="z.B. 2 für 2. OG, 0 für EG"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input 
                v-model.number="acc.square_meters" 
                type="number" 
                label="Wohnfläche (m²)" 
                outlined 
                suffix="m²"
              />
            </div>
          </div>
          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-12 col-md-3">
              <q-input 
                v-model.number="acc.bedrooms" 
                type="number" 
                label="Anzahl Schlafzimmer" 
                outlined 
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input 
                v-model.number="acc.bathrooms" 
                type="number" 
                label="Anzahl Badezimmer/WC" 
                outlined 
              />
            </div>
            <div class="col-12 col-md-3">
              <q-checkbox 
                v-model="acc.has_living_room" 
                label="Wohnzimmer vorhanden" 
                class="q-mt-md"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-checkbox 
                v-model="acc.has_terrace" 
                label="Terrasse/Balkon" 
                class="q-mt-md"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Ausstattung -->
      <q-card class="form-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="home" size="24px" />
            <span>Ausstattung</span>
          </div>
        </q-card-section>
        <q-card-section>
          <q-option-group
            v-model="acc.amenities"
            :options="amenityOptions"
            type="checkbox"
            class="amenities-grid"
          />
        </q-card-section>
      </q-card>

      <!-- Beschreibungen -->
      <q-card class="form-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="description" size="24px" />
            <span>Beschreibungen</span>
          </div>
        </q-card-section>
        <q-card-section>
          <q-input 
            v-model="acc.details" 
            type="textarea" 
            autogrow 
            label="Unterkunftsdetails (intern)" 
            outlined 
            hint="Interne Notizen, werden nicht öffentlich angezeigt"
            class="q-mb-md"
          />

          <!-- Über diese Unterkunft mit KI -->
          <div class="ai-field-group">
            <q-input 
              v-model="acc.about" 
              type="textarea" 
              autogrow 
              label="Über diese Unterkunft (öffentlich)" 
              outlined 
              class="field-input"
              rows="5"
            />
            <q-btn 
              icon="psychology" 
              label="KI generieren" 
              @click="generateAbout"
              :loading="aiLoading.about"
              :disable="!acc.images || acc.images.length === 0"
              outline
              color="blue-7"
              class="ai-action-btn"
            >
              <q-tooltip>{{ acc.images && acc.images.length > 0 ? 'Beschreibung mit KI generieren' : 'Bitte laden Sie zuerst Bilder hoch' }}</q-tooltip>
            </q-btn>
          </div>

          <!-- Anbindung mit KI -->
          <div class="ai-field-group q-mt-md">
            <q-input 
              v-model="acc.connectivity" 
              type="textarea" 
              autogrow 
              label="Anbindung & Infrastruktur (öffentlich)" 
              outlined 
              class="field-input"
              rows="4"
            />
            <q-btn 
              icon="psychology" 
              label="KI generieren" 
              @click="generateConnectivity"
              :loading="aiLoading.connectivity"
              outline
              color="blue-7"
              class="ai-action-btn"
            >
              <q-tooltip>Standortanalyse mit KI generieren</q-tooltip>
            </q-btn>
          </div>

          <q-input 
            v-model="acc.house_rules" 
            type="textarea" 
            autogrow 
            label="Hausregeln (öffentlich)" 
            outlined 
            class="q-mt-md"
            rows="4"
          />
        </q-card-section>
      </q-card>

      <!-- Bilder -->
      <q-card class="form-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="photo_library" size="24px" />
            <span>Bilder</span>
          </div>
        </q-card-section>
        <q-card-section>
          <q-banner v-if="!acc.id" rounded class="bg-info text-white q-mb-md">
            <template #avatar><q-icon name="info" color="white"/></template>
            <strong>Hinweis:</strong> Bitte speichern Sie zuerst die Unterkunft, bevor Sie Bilder hochladen können.
          </q-banner>
          <image-uploader v-if="acc.id" :id="acc.id" :images="acc.images" @uploaded="onImagesUploaded" />
        </q-card-section>
      </q-card>

      <!-- Kalender -->
      <q-card class="form-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="event" size="24px" />
            <span>Verfügbarkeit & Sperrungen</span>
          </div>
        </q-card-section>
        <q-card-section>
          <!-- Instructions -->
          <q-banner class="bg-blue-50 text-blue-900 q-mb-md" rounded>
            <template #avatar>
              <q-icon name="info" color="blue" />
            </template>
            <div class="text-sm">
              <strong>So funktioniert's:</strong>
              <ol class="q-ml-md q-mt-xs">
                <li>Wählen Sie im Kalender einen Zeitraum aus (Start- und Enddatum)</li>
                <li>Wählen Sie "Sperren" oder "Freigeben"</li>
                <li>Klicken Sie auf den entsprechenden Button</li>
              </ol>
            </div>
          </q-banner>

          <div class="calendar-controls">
            <q-btn-toggle 
              v-model="mode" 
              spread 
              toggle-color="primary" 
              :options="[
                {label:'Freigeben', value:'free', icon: 'lock_open'},
                {label:'Sperren', value:'block', icon: 'lock'}
              ]" 
              class="q-mb-md"
            />
            <q-btn 
              flat 
              icon="delete_forever" 
              label="Alle Sperrungen löschen" 
              @click="clearBlocks" 
              :disable="!acc.id"
              color="negative"
            />
          </div>

          <div class="calendar-section">
            <div class="calendar-wrapper">
              <div class="subsection-title q-mb-sm">Zeitraum auswählen</div>
              <q-date 
                v-model="dateRange" 
                range 
                mask="YYYY-MM-DD" 
                locale="de-DE" 
                first-day-of-week="1" 
                :options="isFutureOrToday"
                class="full-width-calendar"
                color="primary"
              />
              <div v-if="dateRange && dateRange.from && dateRange.to" class="selected-range q-mt-sm">
                <q-icon name="event" color="primary" />
                <span class="text-primary font-semibold">
                  {{ dateRange.from }} bis {{ dateRange.to }}
                </span>
              </div>
              <div v-else class="text-grey-6 text-sm q-mt-sm">
                <q-icon name="touch_app" size="16px" />
                Klicken Sie auf ein Startdatum, dann auf ein Enddatum
              </div>
            </div>
            
            <div class="calendar-actions">
              <q-btn 
                :label="mode==='block' ? 'Zeitraum sperren' : 'Zeitraum freigeben'" 
                :icon="mode==='block' ? 'lock' : 'lock_open'"
                :color="mode==='block' ? 'negative' : 'positive'"
                @click="mode==='block' ? blockRange() : freeRange()" 
                :disable="!dateRange || !dateRange.from || !dateRange.to || !acc.id"
                unelevated
                class="q-mb-md full-width"
              >
                <q-tooltip v-if="!dateRange || !dateRange.from || !dateRange.to">
                  Bitte wählen Sie zuerst einen Zeitraum im Kalender
                </q-tooltip>
              </q-btn>
              <q-btn 
                flat 
                label="Aktualisieren" 
                icon="refresh"
                @click="loadBookings"
                color="primary"
                class="full-width"
              />

              <div class="bookings-list q-mt-md">
                <div class="subsection-title">Bestehende Buchungen</div>
                <q-list bordered separator v-if="bookings.length > 0">
                  <q-item v-for="b in bookings" :key="b.id">
                    <q-item-section>
                      <q-item-label>{{ b.check_in }} → {{ b.check_out }}</q-item-label>
                      <q-item-label caption>{{ b.status }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="text-grey-6 q-pa-md text-center">
                  Keine Buchungen vorhanden
                </div>
              </div>

              <div class="availability-preview q-mt-md">
                <div class="subsection-title">Verfügbarkeits-Vorschau (5 Wochen)</div>
                <div class="availability-grid">
                  <div 
                    v-for="day in previewDays" 
                    :key="day.date" 
                    :class="dayClass(day)" 
                    :aria-label="ariaLabel(day)" 
                    role="gridcell"
                  >
                    <span>{{ day.label }}</span>
                    <q-tooltip>{{ tooltipText(day) }}</q-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccommodations } from '../stores/accommodations.js'
import { useAuth } from '../stores/auth.js'
import ImageUploader from '../components/ui/ImageUploader.vue'
import api from '../services/api.js'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const store = useAccommodations()
const auth = useAuth()
const $q = useQuasar()

const acc = ref({ 
  images: [], 
  price_per_night: 0, 
  max_guests: 1, 
  is_active: true, 
  amenities: [],
  property_type: 'apartment',
  floor: null,
  square_meters: null,
  bedrooms: null,
  bathrooms: null,
  has_living_room: false,
  has_terrace: false
})

const price = ref({ extra_costs: { cleaningFee: 40, cleaningFeeThreshold: 4 }, discounts: [] })
const dateRange = ref(null)
const bookings = ref([])
const districtHint = ref('')
const previewDays = ref([])
const postalError = ref(false)
const mode = ref('block')

const propertyTypeOptions = [
  { label: 'Wohnung', value: 'apartment' },
  { label: 'Privatzimmer', value: 'private_room' },
  { label: 'Pension', value: 'guesthouse' },
  { label: 'Haus', value: 'house' },
  { label: 'Studio', value: 'studio' }
]

const amenityOptions = [
  { label: 'WLAN', value: 'wifi' },
  { label: 'Küche', value: 'kitchen' },
  { label: 'Parkplatz', value: 'parking' },
  { label: 'Bad/Dusche', value: 'bathroom' },
  { label: 'TV', value: 'tv' },
  { label: 'Waschmaschine', value: 'laundry' },
  { label: 'Balkon', value: 'balcony' }
]

// AI Loading States
const aiLoading = reactive({
  name: false,
  about: false,
  connectivity: false
})

// AI Generation Functions
const generateName = async () => {
  aiLoading.name = true
  try {
    const { data } = await api.post('/ai/generate-name', {
      property_type: acc.value.property_type,
      floor: acc.value.floor,
      square_meters: acc.value.square_meters,
      bedrooms: acc.value.bedrooms,
      bathrooms: acc.value.bathrooms,
      max_guests: acc.value.max_guests,
      amenities: acc.value.amenities,
      location: acc.value.location,
      postal_code: acc.value.postal_code,
      has_living_room: acc.value.has_living_room,
      has_terrace: acc.value.has_terrace
    })
    
    if (data.success && data.suggestions && data.suggestions.length > 0) {
      $q.dialog({
        title: 'KI-Namensvorschläge',
        message: 'Wählen Sie einen Namen:',
        options: {
          type: 'radio',
          model: data.suggestions[0],
          items: data.suggestions.map(s => ({ label: s, value: s }))
        },
        cancel: { label: 'Abbrechen', flat: true },
        ok: { label: 'Übernehmen', color: 'primary', unelevated: true }
      }).onOk(selected => {
        acc.value.name = selected
        $q.notify({ message: 'Name übernommen', color: 'positive', icon: 'check', position: 'top-right' })
      })
    } else {
      $q.notify({ message: data.error || 'Keine Vorschläge generiert', color: 'warning', icon: 'warning', position: 'top-right' })
    }
  } catch (err) {
    console.error('Name generation error:', err)
    $q.notify({ message: 'Fehler bei der KI-Generierung', color: 'negative', icon: 'error', position: 'top-right' })
  } finally {
    aiLoading.name = false
  }
}

const generateAbout = async () => {
  aiLoading.about = true
  try {
    const { data } = await api.post('/ai/generate-about', {
      name: acc.value.name,
      property_type: acc.value.property_type,
      floor: acc.value.floor,
      square_meters: acc.value.square_meters,
      bedrooms: acc.value.bedrooms,
      bathrooms: acc.value.bathrooms,
      max_guests: acc.value.max_guests,
      amenities: acc.value.amenities,
      location: acc.value.location,
      address: acc.value.address,
      postal_code: acc.value.postal_code,
      details: acc.value.details,
      connectivity: acc.value.connectivity,
      has_living_room: acc.value.has_living_room,
      has_terrace: acc.value.has_terrace,
      images: acc.value.images
    })
    
    if (data.success && data.description) {
      $q.dialog({
        title: 'KI-generierte Beschreibung',
        message: data.description,
        cancel: { label: 'Abbrechen', flat: true },
        ok: { label: 'Übernehmen', color: 'primary', unelevated: true },
        html: true,
        style: 'max-width: 600px'
      }).onOk(() => {
        acc.value.about = data.description
        $q.notify({ message: 'Beschreibung übernommen', color: 'positive', icon: 'check', position: 'top-right' })
      })
    } else {
      $q.notify({ message: data.error || 'Keine Beschreibung generiert', color: 'warning', icon: 'warning', position: 'top-right' })
    }
  } catch (err) {
    console.error('About generation error:', err)
    $q.notify({ message: 'Fehler bei der KI-Generierung', color: 'negative', icon: 'error', position: 'top-right' })
  } finally {
    aiLoading.about = false
  }
}

const generateConnectivity = async () => {
  aiLoading.connectivity = true
  try {
    const { data } = await api.post('/ai/connectivity', {
      address: acc.value.address,
      postal_code: acc.value.postal_code,
      city: 'Leipzig',
      location: acc.value.location
    })
    const p = data?.data
    if (!p) {
      $q.notify({ message: 'Keine Standortdaten gefunden', color: 'warning', icon: 'warning', position: 'top-right' })
      return
    }
    
    // Use AI-generated text if available, otherwise fallback
    const text = p.text && p.text.trim().length ? p.text.trim() : (() => {
      const short = (list) => (Array.isArray(list) ? list.slice(0,3) : [])
      const fmt = (items, label) => {
        const arr = short(items)
        if (!arr.length) return ''
        return `${label}: ` + arr.map(i => `${i.name} (${i.entfernung_m}m)`).join(', ')
      }
      return [
        fmt(p.kategorien?.oepnv, 'ÖPNV'),
        fmt(p.kategorien?.einkauf, 'Einkaufsmöglichkeiten'),
        fmt(p.kategorien?.gastronomie, 'Gastronomie')
      ].filter(Boolean).join('. ') + '.'
    })()
    
    acc.value.connectivity = text.length > 2000 ? text.slice(0,2000) : text
    $q.notify({ message: 'Standortanalyse aktualisiert', color: 'positive', icon: 'check', position: 'top-right' })
  } catch (err) { 
    console.error('Connectivity generation error:', err)
    $q.notify({ message: 'Fehler bei der Standortanalyse', color: 'warning', icon: 'warning', position: 'top-right' })
  } finally {
    aiLoading.connectivity = false
  }
}

function onPostalCodeChange(val) {
  if (!val) return
  const district = plzToDistrict(String(val).trim())
  if (district && !acc.value.location) acc.value.location = district
  districtHint.value = district ? `Empfohlen: ${district}` : ''
  postalError.value = !district
}

function plzToDistrict(plz) {
  const leipzig = {
    '04103': 'Zentrum-Ost', '04105': 'Zentrum-Nord', '04107': 'Zentrum-Süd', '04109': 'Zentrum',
    '04129': 'Schönefeld-Abtnaundorf', '04155': 'Gohlis-Süd', '04157': 'Gohlis-Nord', '04159': 'Wahren/Möckern',
    '04205': 'Grünau-Nord', '04207': 'Grünau-Siedlung', '04209': 'Grünau-Mitte', '04213': 'Kleinzschocher',
    '04229': 'Schleußig', '04249': 'Großzschocher', '04275': 'Connewitz', '04277': 'Lößnig', '04279': 'Dölitz-Dösen',
    '04315': 'Volkmarsdorf', '04317': 'Reudnitz-Thonberg', '04318': 'Sellerhausen-Stünz', '04328': 'Paunsdorf', '04329': 'Heiterblick'
  }
  const chemnitz = {
    '09111': 'Zentrum', '09112': 'Kaßberg', '09113': 'Schloßchemnitz', '09114': 'Schloßchemnitz',
    '09116': 'Altendorf', '09117': 'Rottluff', '09119': 'Siegmar', '09120': 'Altchemnitz',
    '09122': 'Reichenbrand', '09123': 'Rabenstein', '09125': 'Helbersdorf', '09126': 'Bernsdorf',
    '09127': 'Ebersdorf', '09130': 'Sonnenberg', '09131': 'Ebersdorf'
  }
  return leipzig[plz] || chemnitz[plz]
}

onMounted(async () => {
  if (route.params.id !== 'new') {
    await store.fetchOne(route.params.id)
    acc.value = { ...acc.value, ...store.current }
    await loadBookings()
    await loadPrice()
  }
  if (!acc.value.house_rules || acc.value.house_rules.trim() === '') {
    acc.value.house_rules = defaultHouseRules()
  }
})

const save = async () => {
  acc.value.last_modified_by = auth.user.id
  acc.value.images = (acc.value.images || []).map((img, i) => ({
    url: img.url,
    filename: img.filename,
    title: img.title || '',
    order: i,
    isCover: i === 0
  }))
  try {
    if (route.params.id === 'new') {
      const created = await store.create(acc.value)
      if (!created || !created.id) {
        throw new Error('Keine ID vom Server erhalten')
      }
      $q.notify({ message: 'Erfolgreich erstellt', color: 'positive', icon: 'check', position: 'top-right' })
      // Redirect to edit page for new accommodation
      router.push(`/accommodations/${created.id}`)
    } else {
      await store.update(acc.value.id, acc.value)
      $q.notify({ message: 'Erfolgreich gespeichert', color: 'positive', icon: 'check', position: 'top-right' })
      // Reload data to show updated values
      await store.fetchOne(route.params.id)
      acc.value = { ...acc.value, ...store.current }
    }
  } catch (err) {
    console.error('Save error:', err)
    const errorMsg = err?.response?.data?.msg || err?.message || 'Fehler beim Speichern'
    const details = err?.response?.data?.details
    $q.notify({ 
      message: details ? `${errorMsg}: ${details}` : errorMsg, 
      color: 'negative', 
      icon: 'error', 
      position: 'top-right',
      timeout: 5000
    })
  }
}

const onImagesUploaded = (images) => {
  acc.value.images = images
}

const loadBookings = async () => {
  if (!acc.value?.id) return
  const { data } = await api.get(`/bookings`, { params: { accommodation_id: acc.value.id } })
  bookings.value = data
  buildPreview()
}

const blockRange = async () => {
  if (!acc.value?.id || !dateRange.value?.from || !dateRange.value?.to) return
  const from = new Date(dateRange.value.from)
  const to = new Date(dateRange.value.to)
  const daysCount = Math.max(1, Math.round((to - from) / (24 * 60 * 60 * 1000)) + 1)
  await api.post('/bookings', {
    accommodation_id: acc.value.id,
    guest_name: 'Admin Block',
    guest_email: 'admin@local',
    check_in: dateRange.value.from,
    check_out: dateRange.value.to,
    total_price: 0,
    status: 'confirmed',
    notes: 'Admin blockiert'
  })
  await loadBookings()
  $q.notify({
    message: `${daysCount} Tage gesperrt`,
    icon: 'lock',
    color: 'negative',
    textColor: 'white',
    position: 'top-right'
  })
}

const freeRange = async () => {
  if (!acc.value?.id || !dateRange.value?.from || !dateRange.value?.to) return
  const start = dateRange.value.from
  const end = dateRange.value.to
  const list = (await api.get('/bookings', { params: { accommodation_id: acc.value.id } })).data
  const toDelete = list.filter(b => overlaps(b.check_in, b.check_out, start, end) && /Admin blockiert/i.test(b.notes || ''))
  for (const b of toDelete) { await api.delete(`/bookings/${b.id}`) }
  await loadBookings()
  $q.notify({ message: `${toDelete.length} Sperrungen entfernt`, icon: 'lock_open', color: 'positive', position: 'top-right' })
}

const clearBlocks = async () => {
  if (!acc.value?.id) return
  const list = (await api.get('/bookings', { params: { accommodation_id: acc.value.id } })).data
  const blocks = list.filter(b => /Admin blockiert/i.test(b.notes || ''))
  for (const b of blocks) { await api.delete(`/bookings/${b.id}`) }
  await loadBookings()
  $q.notify({ message: `Alle ${blocks.length} Sperrungen gelöscht`, icon: 'delete_forever', color: 'warning', position: 'top-right' })
}

function defaultHouseRules() {
  return [
    'Rücksichtnahme: Bitte achten Sie auf Ruhezeiten (22:00–06:00).',
    'Sauberkeit: Unterkunft besenrein verlassen; Müll fachgerecht entsorgen.',
    'Nichtraucher: Rauchen nur im Außenbereich erlaubt.',
    'Tiere: Haustiere nur nach vorheriger Absprache.',
    'Schlüssel: Verlust umgehend melden; kein Weitergeben an Dritte.',
    'Parken: Nur ausgewiesene Flächen nutzen, keine Zufahrten blockieren.'
  ].join('\n')
}

function inRange(date, from, to) {
  return date >= from && date <= to
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return !(aEnd < bStart || aStart > bEnd)
}

function buildPreview() {
  const today = new Date()
  const result = []
  for (let i = 0; i < 35; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const key = `${yyyy}-${mm}-${dd}`
    const isBlocked = bookings.value?.some(b => inRange(key, b.check_in, b.check_out))
    const isPending = !!(dateRange.value?.from && dateRange.value?.to && inRange(key, dateRange.value.from, dateRange.value.to))
    result.push({ date: key, label: dd, blocked: isBlocked, pending: isPending })
  }
  previewDays.value = result
}

function dayClass(day) {
  if (day.blocked) return 'day day-blocked'
  if (day.pending) return 'day day-pending'
  return 'day day-available'
}

function ariaLabel(day) {
  return day.blocked ? `Gesperrt: ${day.date}` : (day.pending ? `Geplant gesperrt: ${day.date}` : `Verfügbar: ${day.date}`)
}

function tooltipText(day) {
  return day.blocked ? 'Gesperrt' : (day.pending ? 'Ausgewählt (noch nicht gespeichert)' : 'Verfügbar')
}

buildPreview()

watch(dateRange, () => {
  buildPreview()
}, { deep: true })

function isFutureOrToday(d) {
  const today = new Date(); today.setHours(0,0,0,0)
  const x = new Date(d.year, d.month - 1, d.day)
  return x >= today
}

const savePrice = async () => {
  if (!acc.value?.id) return
  const payload = { ...price.value, accommodation_id: acc.value.id }
  try {
    const exists = await api.get(`/pricing/${acc.value.id}`).then(r => r.data).catch(() => null)
    if (exists) {
      await api.put(`/pricing/${acc.value.id}`, payload)
    } else {
      await api.post('/pricing', payload)
    }
    $q.notify({ message: 'Preis gespeichert', color: 'positive', icon: 'check', position: 'top-right' })
  } catch (err) {
    $q.notify({ message: 'Fehler beim Speichern', color: 'negative', icon: 'error', position: 'top-right' })
  }
}

const loadPrice = async () => {
  if (!acc.value?.id) return
  try {
    const cfg = await api.get(`/pricing/${acc.value.id}`).then(r => r.data)
    if (cfg) price.value = cfg
  } catch (err) {
    // Price config doesn't exist yet
  }
}

const pricePreviewText = computed(() => {
  const cf = price.value?.extra_costs || {}
  const perNight = Number(acc.value?.price_per_night || 0).toFixed(2)
  return `Preis/Nacht: €${perNight} · Reinigung ab ${cf.cleaningFeeThreshold||4} Nächten: €${Number(cf.cleaningFee||0).toFixed(2)}`
})
</script>

<style scoped>
.modern-edit-page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 24px;
}

.warning-banner {
  background: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
}

.save-btn {
  height: 48px;
  padding: 0 32px;
  border-radius: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 24px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.subsection-title {
  font-size: 16px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 12px;
  margin-top: 16px;
}

.ai-field-group {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.field-input {
  flex: 1;
}

.ai-action-btn {
  margin-top: 8px;
  border-radius: 10px;
  font-weight: 600;
  border-width: 2px;
  padding: 8px 20px;
  transition: all 0.3s ease;
}

.ai-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.price-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
}

.selected-range {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #eff6ff;
  border-radius: 8px;
  border: 1px solid #3b82f6;
}

.full-width {
  width: 100%;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.calendar-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.calendar-wrapper {
  display: flex;
  justify-content: center;
}

.full-width-calendar {
  width: 100%;
  max-width: 400px;
}

.calendar-actions {
  display: flex;
  flex-direction: column;
}

.bookings-list {
  margin-top: 16px;
}

.availability-preview {
  margin-top: 24px;
}

.availability-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.day {
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: default;
}

.day:hover { 
  transform: scale(1.05); 
}

.day-available { 
  background: #dcfce7; 
  color: #166534;
  border: 2px solid #86efac;
}

.day-pending { 
  background: #fef3c7; 
  color: #92400e;
  border: 2px solid #fbbf24;
}

.day-blocked { 
  background: #fee2e2; 
  color: #991b1b;
  border: 2px solid #fca5a5;
  text-decoration: line-through;
}


@media (max-width: 1024px) {
  .calendar-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .modern-edit-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .ai-field-group {
    flex-direction: column;
  }
  
  .ai-action-btn {
    width: 100%;
  }
}
</style>
