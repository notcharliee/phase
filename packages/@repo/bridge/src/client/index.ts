import { createTRPCClient, httpBatchLink } from "@trpc/client"

import { env } from "~/client/env"
import { url } from "~/utils"

import type { AppRouter } from "~/server/router"

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url,
      headers: {
        Authorization: `Secret ${env.BRIDGE_TOKEN}`,
      },
    }),
  ],
})
