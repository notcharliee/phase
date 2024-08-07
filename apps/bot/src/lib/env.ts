import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    MONGODB_URI: z.string(),
    DISCORD_TOKEN: z.string(),
    TWITCH_CLIENT_ID: z.string(),
    TWITCH_CLIENT_SECRET: z.string(),
    AUTH_OTP_SECRET: z.string(),
    WEBHOOK_ALERT: z.string(),
    API_YOUTUBE: z.string(),
    GOOGLE_EMAIL: z.string(),
    GOOGLE_PASSWORD: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
