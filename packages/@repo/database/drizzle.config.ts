import { defineConfig } from "drizzle-kit"

import { env } from "~/lib/env"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/postgres/schemas/**/*",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URI,
  },
})
