import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/mongo/index.ts", "./src/postgres/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: true,
  sourcemap: true,
})
