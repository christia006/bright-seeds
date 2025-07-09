import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // --- ADD THIS 'server' BLOCK ---
  server: {
    proxy: {
      '/api': { // Any request starting with /api (e.g., /api/register, /api/login)
        target: 'http://localhost:5000', // Will be forwarded to your backend running on port 5000
        changeOrigin: true, // Needed for virtual hosting sites
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // This line is correct for your backend routes
      },
    },
  },
  // --- END ADDITION ---
})