import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    // Ensure environment variables are properly replaced
    'process.env': process.env,
  },
  build: {
    sourcemap: mode === 'staging',
    outDir: 'dist',
  },
}));
