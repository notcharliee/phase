import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/client/index.ts", "./src/server/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: false,
  sourcemap: true,
})
