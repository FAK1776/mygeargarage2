import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Building for mode:', mode);
  console.log('Environment variables loaded:', Object.keys(env).filter(key => key.startsWith('VITE_')));
  
  return {
    plugins: [react()],
    build: {
      sourcemap: mode === 'staging',
      outDir: 'dist',
    }
  }
})
