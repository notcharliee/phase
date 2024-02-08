import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"


export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    MONGODB_URI: z.string(),
    DISCORD_TOKEN: z.string(),
    DISCORD_SECRET: z.string(),
    DISCORD_ID: z.string(),
    WEBHOOK_ALERT: z.string(),
    WEBHOOK_STATUS: z.string(),
    API_YOUTUBE: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
