import { defineConfig } from 'vite'
import { resolve } from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({ include: ['lib'] }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    },
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es'],
    },
    copyPublicDir: false
  }
})
