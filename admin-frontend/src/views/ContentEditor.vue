<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Inhalte bearbeiten</div>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-3">
        <q-list bordered separator class="bg-white rounded-borders">
          <q-item 
            v-for="(schema, key) in pageSchemas" 
            :key="key" 
            clickable 
            @click="load(key)" 
            :active="currentKey === key"
            active-class="bg-blue-1 text-primary"
          >
            <q-item-section>{{ schema.label }}</q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12 col-sm-9">
        <q-card v-if="currentKey" flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ pageSchemas[currentKey].label }}</div>
            <q-form @submit="save" class="q-gutter-md">
              <div v-for="field in pageSchemas[currentKey].fields" :key="field.key">
                <div class="text-subtitle2 q-mb-xs">{{ field.label }}</div>
                <q-input 
                  v-if="field.type !== 'textarea'"
                  v-model="content[field.key]" 
                  outlined 
                  dense
                  :placeholder="field.placeholder"
                />
                <q-input 
                  v-else
                  v-model="content[field.key]" 
                  outlined 
                  type="textarea"
                  rows="4"
                  :placeholder="field.placeholder"
                />
                <div class="text-caption text-grey">{{ field.hint }}</div>
              </div>
              
              <div class="row justify-end q-mt-lg">
                <q-btn label="Speichern" type="submit" color="primary" icon="save" :loading="saving" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        <div v-else class="flex flex-center text-grey q-pa-xl">
          Bitte wählen Sie eine Seite aus.
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '../services/api.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const currentKey = ref('')
const content = ref({})
const saving = ref(false)

const pageSchemas = {
  home: {
    label: 'Startseite',
    fields: [
      { key: 'hero_title', label: 'Hero Titel', placeholder: 'Willkommen bei...', hint: 'Die Hauptüberschrift auf der Startseite' },
      { key: 'hero_subtitle', label: 'Hero Untertitel', type: 'textarea', hint: 'Der beschreibende Text unter der Überschrift' },
      { key: 'hero_cta1', label: 'Button 1 Text', placeholder: 'Jetzt buchen' },
      { key: 'hero_cta2', label: 'Button 2 Text', placeholder: 'Mehr erfahren' }
    ]
  },
  about: {
    label: 'Über uns',
    fields: [
      { key: 'about_title', label: 'Überschrift', placeholder: 'Über uns' },
      { key: 'about_description', label: 'Beschreibung', type: 'textarea' }
    ]
  },
  contact: {
    label: 'Kontakt',
    fields: [
      { key: 'contact_title', label: 'Überschrift', placeholder: 'Kontaktieren Sie uns' },
      { key: 'contact_email', label: 'E-Mail Adresse' },
      { key: 'contact_phone', label: 'Telefonnummer' }
    ]
  },
  faq: {
    label: 'FAQ',
    fields: [
      { key: 'faq_title', label: 'Überschrift', placeholder: 'Häufig gestellte Fragen' },
      { key: 'faq_intro', label: 'Einleitungstext', type: 'textarea' }
    ]
  }
}

const load = async (key) => {
  currentKey.value = key
  content.value = {} // Reset first
  
  try {
    const { data } = await api.get(`/content?page=${key}`)
    // Find the entry with section 'main' if it exists, or just take the first one
    const entry = Array.isArray(data) ? data.find(d => d.section === 'main') : data
    
    if (entry && entry.content) {
      content.value = { ...entry.content }
    }
  } catch (e) {
    console.error('Error loading content', e)
  }
}

const save = async () => {
  saving.value = true
  try {
    await api.post('/content', { 
      page: currentKey.value, 
      section: 'main', 
      content: content.value 
    })
    $q.notify({ type: 'positive', message: 'Inhalte erfolgreich gespeichert' })
  } catch (e) {
    console.error('Error saving content', e)
    $q.notify({ type: 'negative', message: 'Fehler beim Speichern' })
  } finally {
    saving.value = false
  }
}
</script>