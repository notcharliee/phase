import { BotPlugin } from "@phasejs/core/client"

import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { env } from "~/lib/env"
import { pluginVersion } from "~/lib/utils"

import { createContext } from "~/server/context"
import { appRouter } from "~/server/router"

import type { DjsClient } from "~/types/bot"

export const endpoint = "/api/trpc"
export const url = env.BASE_URL + endpoint

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
    version: pluginVersion,
    onLoad: (phase) => {
      startServer({ client: phase.client })
    },
  })
}
