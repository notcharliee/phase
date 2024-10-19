import { createEnv } from "@t3-oss/env-core"
import { railway } from "@t3-oss/env-core/presets"
import { z } from "zod"

export const env = createEnv({
  extends: [railway()],
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    MONGODB_URI: z.string(),
    POSTGRES_URI: z.string(),
    DISCORD_TOKEN: z.string(),
    TWITCH_CLIENT_ID: z.string(),
    TWITCH_CLIENT_SECRET: z.string(),
    AUTH_OTP_SECRET: z.string(),
    WEBHOOK_ALERT: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
