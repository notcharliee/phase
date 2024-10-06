import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/index.ts", "./src/structures/builders/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: true,
  sourcemap: true,
})
