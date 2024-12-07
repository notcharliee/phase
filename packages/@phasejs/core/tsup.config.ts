import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "./src/index.ts",
    "./src/client.ts",
    "./src/stores.ts",
    "./src/builders/index.ts",
    "./src/managers/index.ts",
  ],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: true,
  sourcemap: true,
})
