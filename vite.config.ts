import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Ícones e ajustes finos do PWA são finalizados na Etapa 7 do PLANO.md.
      manifest: {
        name: 'Cesta — Despensa e Listas',
        short_name: 'Cesta',
        description: 'Despensa e listas de compras da casa',
        lang: 'pt-BR',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
