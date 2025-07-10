import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Tidak perlu server proxy di sini untuk production (Vercel)
  // Karena Vercel akan otomatis handle /api/* ke frontend/api/*.js
})
