import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative pathing for GitHub Pages
  build: {
    rollupOptions: {
      output: {
        // Keep the heavy 3D stack (three + react-three-fiber + drei) in its own
        // chunk so it only loads when the lazy Topology3D component mounts and
        // never bloats the main bundle / first paint.
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
