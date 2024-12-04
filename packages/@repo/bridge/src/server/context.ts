import { env } from "~/server/env"

import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import type { DjsClient } from "~/types/bot"

interface CreateContextParams extends FetchCreateContextFnOptions {
  client: DjsClient
}

export function createContext({ req, client }: CreateContextParams) {
  const headers = req.headers

  const authorization = headers.get("Authorization") ?? ""
  const [prefix, token] = authorization.split(" ")

  const isAuthorized = prefix === "Secret" && token === env.BRIDGE_TOKEN

  return {
    client,
    isAuthorized,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
