import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      // Absoluter Pfad, damit der Sass-Import in node_modules/quasar/src/css/index.sass greift
      sassVariables: resolve(__dirname, 'src/quasar-variables.sass')
    })
  ],
  css: {
    preprocessorOptions: {
      sass: {
        // Erlaubt Imports wie 'src/...'
        includePaths: [resolve(__dirname, 'src'), __dirname]
      }
    }
  },
  server: { port: 5175, strictPort: true }
})
