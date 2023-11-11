import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DISCORD_TOKEN: z.string(),
    DISCORD_SECRET: z.string(),
    DISCORD_ID: z.number(),
    MONGODB_URI: z.string(),
    UPSTASH_URL: z.string(),
    UPSTASH_TOKEN: z.string(),
    WEBHOOK_ALERT: z.string(),
    WEBHOOK_STATUS: z.string(),
    API_YOUTUBE: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string(),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_SECRET: process.env.DISCORD_SECRET,
    DISCORD_ID: process.env.DISCORD_ID,
    MONGODB_URI: process.env.MONGODB_URI,
    UPSTASH_URL: process.env.UPSTASH_URL,
    UPSTASH_TOKEN: process.env.UPSTASH_TOKEN,
    WEBHOOK_ALERT: process.env.WEBHOOK_ALERT,
    WEBHOOK_STATUS: process.env.WEBHOOK_STATUS,
    API_YOUTUBE: process.env.API_YOUTUBE,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
