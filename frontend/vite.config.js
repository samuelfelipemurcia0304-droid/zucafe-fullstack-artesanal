import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' hace que la página cargue bien en GitHub Pages (usuario.github.io/repositorio/)
export default defineConfig({
  plugins: [react()],
  base: './',
});
