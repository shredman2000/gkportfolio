import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..')
  const env = loadEnv(mode, envDir, '') 

  console.log('VITE_API_TARGET:', env.VITE_API_TARGET)
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': env.VITE_API_TARGET
      }
    }
  }
})
