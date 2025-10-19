import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages path: https://nickmcm92.github.io/poke-cards/
export default defineConfig({
  base: '/poke-cards/',
  plugins: [react()],
})