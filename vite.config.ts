import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    sourcemap: mode === 'staging',
    outDir: 'dist',
  },
  define: {
    // Ensure environment variables are properly replaced during build
    'process.env.NODE_ENV': JSON.stringify(mode),
    ...Object.keys(process.env).reduce((env, key) => {
      if (key.startsWith('VITE_')) {
        env[`import.meta.env.${key}`] = JSON.stringify(process.env[key])
      }
      return env
    }, {})
  }
}));
