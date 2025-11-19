import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/auth.js'
const disableAuth = String(import.meta.env.VITE_DISABLE_AUTH || '').toLowerCase() === 'true'

const routes = [
  { path: '/login', component: () => import('../views/Login.vue'), meta: { guest: true } },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    meta: { auth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: '/accommodations', name: 'Accommodations', component: () => import('../views/Accommodations.vue') },
      { path: '/accommodations/:id', name: 'AccommodationEdit', component: () => import('../views/AccommodationEdit.vue'), meta: { edit: true } },
      { path: '/bookings', name: 'Bookings', component: () => import('../views/Bookings.vue') },
      { path: '/content', name: 'ContentEditor', component: () => import('../views/ContentEditor.vue'), meta: { edit: true } },
      { path: '/modern', name: 'ModernDashboard', component: () => import('../views/ModernDashboard.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuth()
  if (disableAuth) return next()
  if (to.meta.auth && !auth.isAuth) return next('/login')
  if (to.meta.edit && !auth.canEdit) return next('/')
  next()
})

export default router
