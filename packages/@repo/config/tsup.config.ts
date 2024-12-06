import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/**/*.{ts,js}"],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: true,
  sourcemap: true,
})
