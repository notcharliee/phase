import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DISCORD_TOKEN: z.string(),
    DISCORD_SECRET: z.string(),
    DISCORD_ID: z.string(),
    MONGODB_URI: z.string(),
    KV_URL: z.string(),
    KV_REST_API_URL: z.string(),
    KV_REST_API_TOKEN: z.string(),
    KV_REST_API_READ_ONLY_TOKEN: z.string(),
    NEXT_MIDDLEWARE_AUTH_ID: z.string().optional(),
    NEXT_MIDDLEWARE_USER_ID: z.string().optional(),
    NEXT_MIDDLEWARE_USER_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_SECRET: process.env.DISCORD_SECRET,
    DISCORD_ID: process.env.DISCORD_ID,
    MONGODB_URI: process.env.MONGODB_URI,
    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_MIDDLEWARE_AUTH_ID: process.env.NEXT_MIDDLEWARE_AUTH_ID,
    NEXT_MIDDLEWARE_USER_ID: process.env.NEXT_MIDDLEWARE_USER_ID,
    NEXT_MIDDLEWARE_USER_TOKEN: process.env.NEXT_MIDDLEWARE_USER_TOKEN,
  },
  skipValidation: false,
  emptyStringAsUndefined: true,
})
