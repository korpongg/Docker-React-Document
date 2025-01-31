import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Exclude the 'storage' directory from being removed during the build
      exclude: ['storage/**'],
    },
  },
  plugins: [react()],
  server: {
    port: 3000,
  },
})
