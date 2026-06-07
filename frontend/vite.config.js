import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward booking API calls to the Express backend during local dev so the
    // React app can just fetch('/api/booking') without worrying about CORS or
    // ports. Backend runs on PORT (default 5174) from `.env`.
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
    },
  },
})
