import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@interfaces': path.resolve(__dirname, 'interfaces'),
      '@services': path.resolve(__dirname, 'services'),
      '@components': path.resolve(__dirname, 'components'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@contexts': path.resolve(__dirname, 'contexts'),
      '@modules': path.resolve(__dirname, 'modules'),
    },
  },
});
