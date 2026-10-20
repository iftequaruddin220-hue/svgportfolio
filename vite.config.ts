import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync } from 'node:fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-root-assets',
      closeBundle() {
        cpSync('assets', 'dist/assets', { recursive: true });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
});
