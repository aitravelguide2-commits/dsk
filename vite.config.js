import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/dsk/',
  plugins: [vue()],
  server: {
    host: true,
    port: 3000
  }
})
