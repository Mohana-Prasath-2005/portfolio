import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
  build: {
    // three.js lives in a lazily loaded chunk (src/three/Scene.jsx) that never blocks first paint
    chunkSizeWarningLimit: 900,
  },
})
