import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    MONGODB_URI: z.string(),
    DISCORD_TOKEN: z.string(),
    DISCORD_SECRET: z.string(),
    DISCORD_ID: z.string(),
    TWITCH_CLIENT_SECRET: z.string(),
    TWITCH_CLIENT_ID: z.string(),
    AUTH_COOKIE_SECRET: z.string(),
    AUTH_OTP_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_SECRET: process.env.DISCORD_SECRET,
    DISCORD_ID: process.env.DISCORD_ID,
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
    AUTH_COOKIE_SECRET: process.env.AUTH_COOKIE_SECRET,
    AUTH_OTP_SECRET: process.env.AUTH_OTP_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  skipValidation: false,
  emptyStringAsUndefined: true,
})
