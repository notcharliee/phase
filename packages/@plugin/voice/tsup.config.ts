import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "./src/index.ts",
    "./src/client/index.ts",
    "./src/builders/index.ts",
    "./src/managers/index.ts",
    "./src/stores/index.ts",
  ],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: true,
  sourcemap: true,
})
