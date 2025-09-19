import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['lib'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'MentionMenu',
      formats: ['es', 'cjs'],
      fileName: (format) => `main.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        assetFileNames: 'assets/[name][extname]', 
        exports: 'named'
      },
    },
    copyPublicDir: false,
  },
})
