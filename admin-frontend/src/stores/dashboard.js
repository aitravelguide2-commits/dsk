import { defineStore } from 'pinia'
import api from '../services/api.js'

export const useDashboard = defineStore('dashboard', {
  state: () => ({
    stats: { totalBookings: 0, totalRevenue: 0, totalAccommodations: 0, pendingBookings: 0 },
    recent: [],
    chart: { labels: [], datasets: [{ label: 'Buchungen', data: [], borderColor: '#1976d2', backgroundColor: 'rgba(25,118,210,0.1)', tension: 0.3 }] }
  }),
  actions: {
    async fetchStats() { this.stats = (await api.get('/dashboard/stats')).data },
    async fetchRecent() { this.recent = (await api.get('/dashboard/recent-bookings')).data },
    async fetchChart() { this.chart = (await api.get('/dashboard/chart-data')).data }
  }
})