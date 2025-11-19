import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Dialog, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import router from './router/index.js'
import { useAuth } from './stores/auth.js'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Quasar, { 
  plugins: {
    Dialog,
    Notify
  } 
})
// Session initialisieren, falls Token vorhanden
useAuth().init()
app.mount('#app')
