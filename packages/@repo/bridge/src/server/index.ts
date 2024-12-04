import { BotPlugin } from "@phasejs/core/client"

import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { createContext } from "~/server/context"
import { env } from "~/server/env"
import { appRouter } from "~/server/router"
import { endpoint, version } from "~/utils"

import type { DjsClient } from "~/types/bot"

export function startServer({ client }: { client: DjsClient<true> }) {
  return Bun.serve({
    port: env.PORT,
    fetch(request) {
      return fetchRequestHandler({
        endpoint,
        req: request,
        router: appRouter,
        createContext: (opts) => createContext({ ...opts, client }),
      })
    },
  })
}

export function bridgeServerPlugin() {
  return new BotPlugin({
    name: "BridgeServer",
    trigger: "ready",
    version: version,
    onLoad: (phase) => {
      startServer({ client: phase.client })
    },
  })
}
