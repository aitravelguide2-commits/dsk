import { defineStore } from 'pinia'
import api from '../services/api.js'

export const useAccommodations = defineStore('accommodations', {
  state: () => ({ items: [], current: null, demo: false, error: null }),
  actions: {
    async fetchAll() {
      try {
        this.items = (await api.get('/accommodations')).data
        this.error = null; this.demo = false
      } catch (err) {
        this.error = err; this.demo = true
        this.items = [
          { id: 'demo-1', name: 'Demo Apartment Mitte', price_per_night: 79, max_guests: 3 },
          { id: 'demo-2', name: 'Demo Studio Süd', price_per_night: 59, max_guests: 2 }
        ]
      }
    },
    async fetchOne(id) {
      try {
        this.current = (await api.get(`/accommodations/${id}`)).data
        this.error = null
      } catch (err) {
        this.error = err; this.demo = true
        this.current = {
          id,
          name: 'Demo Unterkunft',
          description: 'Keine Verbindung zum Backend. Demodaten werden angezeigt.',
          price_per_night: 0,
          max_guests: 1,
          images: []
        }
      }
    },
    async create(payload) {
      try { 
        const response = await api.post('/accommodations', payload)
        await this.fetchAll()
        return response.data
      }
      catch (err) { 
        this.error = err
        throw err
      }
    },
    async update(id, payload) {
      try { await api.put(`/accommodations/${id}`, payload) }
      catch (err) { this.error = err }
    },
    async delete(id) {
      try { await api.delete(`/accommodations/${id}`); await this.fetchAll() }
      catch (err) { this.error = err }
    },
    async uploadImages(id, files) {
      try {
        const fd = new FormData(); files.forEach(f => fd.append('images', f))
        const { data } = await api.post(`/accommodations/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        if (this.current?.id === id) this.current.images = data.images || data
      } catch (err) { this.error = err }
    },
    async deleteImage(id, file) {
      try {
        await api.delete(`/accommodations/${id}/images/${file}`)
        if (this.current?.id === id) this.current.images = this.current.images.filter(i => i.filename !== file)
      } catch (err) { this.error = err }
    }
  }
})
