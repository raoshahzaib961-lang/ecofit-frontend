import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This redirects the broken import to our empty file
      '@mediapipe/pose': path.resolve(__dirname, './src/empty.js'),
    },
  },
  optimizeDeps: {
    // Force Vite to re-bundle these correctly
    include: [
      '@tensorflow/tfjs',
      '@tensorflow-models/pose-detection',
      '@tensorflow/tfjs-backend-webgl',
      '@tensorflow/tfjs-converter'
    ]
  }
})