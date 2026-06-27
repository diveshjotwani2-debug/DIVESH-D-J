import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures relative assets loading for subdirectories like GitHub Pages
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000 // Suppresses size warnings for large WebGL libraries
  }
})
