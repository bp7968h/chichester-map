import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), wasm()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['osm_parser', 'path_finder']
  },
  build: {
    target: "esnext",
  }
})
