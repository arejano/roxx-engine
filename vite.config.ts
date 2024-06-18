import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MinhaLib',
      fileName: (format) => `minha-lib.${format}.js`
    },
    rollupOptions: {
      external: [], // Adicione dependências externas se necessário
    }
  }
})
