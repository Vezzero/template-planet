import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // Fondamentale per Docker (ascolta su 0.0.0.0)
    port: 5173,       // Porta standard
    watch: {
      usePolling: true // Serve su Windows per vedere le modifiche in tempo reale
    },
    proxy: {          // Proxy per il backend Django
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})