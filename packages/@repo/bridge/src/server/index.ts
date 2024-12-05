import { BotPlugin } from "@phasejs/core/client"

import { getEnv } from "@repo/env"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { version } from "~/../package.json"
import { createContext } from "~/server/context"
import { appRouter } from "~/server/router"

import type { BotPluginVersion } from "@phasejs/core"
import type { DjsClient } from "~/types/bot"

export function startServer({ client }: { client: DjsClient<true> }) {
  const env = getEnv("bot")

  return Bun.serve({
    port: env.BRIDGE_PORT,
    fetch(request) {
      return fetchRequestHandler({
        endpoint: "/",
        req: request,
        router: appRouter,
        createContext: (opts) =>
          createContext({ ...opts, client, token: env.BRIDGE_TOKEN }),
      })
    },
  })
}

export function bridgeServerPlugin() {
  return new BotPlugin({
    name: "BridgeServer",
    trigger: "ready",
    version: version as BotPluginVersion,
    onLoad: (phase) => {
      startServer({ client: phase.client as DjsClient<true> })
    },
  })
}
