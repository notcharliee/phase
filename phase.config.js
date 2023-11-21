/** @type {import("utils").PhaseConfig} */
const config = {
  scripts: [
    {
      app: "bot",
      build: "npx tsc",
      start: "node build/client/index.js",
      dev: "npx tsc --watch",
    },
    {
      app: "site",
      build: "npx next build",
      start: "npx next start",
      dev: "npx next dev",
    },
    {
      app: "utils",
      build: "npx tsup",
      dev: "npx tsup --watch",
    },
  ],
}

export default config