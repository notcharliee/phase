import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/variables/index.ts", "./src/modules/index.ts"],
  clean: true,
  dts: true,
  minify: true,
  splitting: false,
  format: ["esm"],
  sourcemap: "inline",
})
