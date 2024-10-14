import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "./src/index.ts",
    "./src/structures/builders/index.ts",
    "./src/structures/managers/index.ts",
    "./src/structures/stores/index.ts",
  ],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: true,
  sourcemap: true,
})
