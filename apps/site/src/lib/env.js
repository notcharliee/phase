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

    KV_URL: z.string(),
    KV_REST_API_URL: z.string(),
    KV_REST_API_TOKEN: z.string(),
    KV_REST_API_READ_ONLY_TOKEN: z.string(),

    NEXT_MIDDLEWARE_USER_ID: z.string().optional(),
    NEXT_MIDDLEWARE_GUILD_ID: z.string().optional(),
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

    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,

    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,

    NEXT_MIDDLEWARE_USER_ID: process.env.NEXT_MIDDLEWARE_USER_ID,
    NEXT_MIDDLEWARE_GUILD_ID: process.env.NEXT_MIDDLEWARE_GUILD_ID,
  },
  skipValidation: false,
  emptyStringAsUndefined: true,
})
