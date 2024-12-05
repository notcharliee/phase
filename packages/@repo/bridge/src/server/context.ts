import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import type { DjsClient } from "~/types/bot"

interface CreateContextParams extends FetchCreateContextFnOptions {
  client: DjsClient
  token: string
}

export function createContext(params: CreateContextParams) {
  const headers = params.req.headers

  const authorization = headers.get("Authorization") ?? ""
  const [prefix, token] = authorization.split(" ")

  const isAuthorized = prefix === "Secret" && token === params.token

  return {
    client: params.client,
    isAuthorized,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
