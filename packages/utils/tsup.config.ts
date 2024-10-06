import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/variables/index.ts", "./src/modules/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: false,
  sourcemap: true,
})
