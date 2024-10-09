/* eslint-disable no-undef */

import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-nextjs/presets"
import { z } from "zod"

const BASE_URL =
  process.env.VERCEL_ENV === "production"
    ? "https://phasebot.xyz"
    : process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

export const env = createEnv({
  extends: [vercel()],
  experimental__runtimeEnv: {},
  emptyStringAsUndefined: true,
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
    BASE_URL: z.string().default(BASE_URL),
  },
})
