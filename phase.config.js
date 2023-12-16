/** @type {import("utils").PhaseConfig} */
const config = {
  scripts: [
    {
      app: "bot",
      build: "npx tsc",
      start: "node build/main.js",
      dev: "npx tsc --watch",
    },
    {
      app: "site",
      build: "npx next build",
      start: "npx next start",
      dev: "npx next dev",
    },
  ],
}

export default config