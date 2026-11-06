import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes the built site work from ANY folder/URL
// (GitHub Pages project sites live at /repo-name/, so absolute paths would break).
export default defineConfig({
  plugins: [react()],
  base: './'
});
