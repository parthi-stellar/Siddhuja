import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user-logins': 'http://localhost:8080',
      '/user-login-controller': 'http://localhost:8080',
    },
  },
})
