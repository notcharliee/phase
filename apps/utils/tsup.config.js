import { defineConfig } from 'tsup'

export default defineConfig ({
  entry: ['src'],
  splitting: false,
  clean: true,
  dts: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
})