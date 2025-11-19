import { defineStore } from 'pinia'
import api from '../services/api.js'
import supabase from '../services/supabase.js'

export const useAuth = defineStore('auth', {
  state: () => ({ user: null, token: localStorage.token, _heartbeat: null }),
  getters: { isAuth: s => !!s.token, isAdmin: s => s.user?.role === 'admin', canEdit: s => ['admin', 'editor'].includes(s.user?.role) },
  actions: {
    async login(creds) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: creds.email, password: creds.password })
      if (error) throw error
      const accessToken = data.session?.access_token
      this.token = accessToken
      localStorage.token = accessToken
      await this.me()
      this.startHeartbeat()
    },
    async me() {
      if (!this.token) return
      try {
        this.user = (await api.get('/auth/me')).data
      } catch (e) { /* ignore */ }
    },
    init() {
      if (!this.token) return
      this.me()
      this.startHeartbeat()
    },
    startHeartbeat() {
      if (this._heartbeat) return
      this._heartbeat = setInterval(async () => {
        try { await this.me() } catch (e) { /* ignore */ }
      }, 5 * 60 * 1000)
    },
    stopHeartbeat() { if (this._heartbeat) { clearInterval(this._heartbeat); this._heartbeat = null } },
    async logout() { await supabase.auth.signOut(); localStorage.clear(); this.stopHeartbeat(); this.$reset() }
  }
})
