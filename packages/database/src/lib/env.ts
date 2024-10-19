import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    POSTGRES_URI: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
