import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  
  console.log('Building for mode:', mode);
  console.log('Environment variables loaded:', Object.keys(process.env).filter(key => key.startsWith('VITE_')));
  
  return {
    plugins: [react()],
    build: {
      sourcemap: mode === 'staging',
      outDir: 'dist',
    },
    define: {
      // Pass environment variables to the client
      'import.meta.env': JSON.stringify({
        ...Object.fromEntries(
          Object.entries(process.env).filter(([key]) => key.startsWith('VITE_'))
        ),
        MODE: mode,
      })
    }
  }
})
