import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: set base to the repo name for a project Pages site
export default defineConfig({
  base: '/multi-timer-0-page/',
  plugins: [react()],
});