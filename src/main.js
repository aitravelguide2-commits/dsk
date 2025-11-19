import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { messages } from './locales'
import './style.css'
import 'leaflet/dist/leaflet.css'

const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'de',
  messages
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./components/Home.vue') },
    { path: '/unterkuenfte', component: () => import('./components/Accommodations.vue') },
    { path: '/unterkunft/:id', component: () => import('./components/AccommodationDetail.vue') },
    { path: '/buchung/:id?', component: () => import('./components/Booking.vue') },
    { path: '/kontakt', component: () => import('./components/Contact.vue') },
    { path: '/ueber-uns', component: () => import('./components/About.vue') },
    { path: '/faq', component: () => import('./components/FAQ.vue') },
    { path: '/impressum', component: () => import('./components/Impressum.vue') },
    { path: '/datenschutz', component: () => import('./components/Datenschutz.vue') },
    { path: '/agb', component: () => import('./components/AGB.vue') },
    // Catch-all: Leite unbekannte Pfade (z. B. /dsk/) auf die Startseite um
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // Immer zum Seitenanfang scrollen, keine automatische Navigation zum Footer
    return { left: 0, top: 0 }
  }
})

createApp(App).use(i18n).use(router).mount('#app')
