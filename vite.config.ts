import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync } from 'node:fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-root-assets',
      closeBundle() {
        try {
          cpSync('assets', 'dist/assets', { recursive: true, force: true });
        } catch (e) {
          console.warn('Asset copy notice:', e);
        }
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
