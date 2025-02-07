import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  plugins: [react(), svgr(), basicSsl()],
  server: { https: true },
})
