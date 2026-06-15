import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Load env from the monorepo root so DATABASE_URL/PORT-style config lives in one place.
const rootEnv = loadEnv('', '../../', '');
// Use 127.0.0.1 (not "localhost") so the proxy doesn't try IPv6 ::1 first and get ECONNREFUSED.
const apiTarget = `http://127.0.0.1:${rootEnv.PORT ?? '4000'}`;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    // Proxy API calls to the backend so the browser stays same-origin (no CORS in dev).
    // The client falls back to the relative "/api" base when VITE_API_URL is unset.
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
