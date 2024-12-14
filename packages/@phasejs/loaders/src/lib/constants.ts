export { version } from "package.json"

export const defaultValidExtnames = [
  ".js",
  ".cjs",
  ".mjs",
  ...("Bun" in globalThis || "Deno" in globalThis
    ? [".ts", ".cts", ".mts"]
    : []),
]
