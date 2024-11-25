import type { Server } from "bun"
import type { Client } from "discord.js"

export type BridgeEndpointMethod = "GET"

export type BridgeEndpointVersion = `${number}`

export type BridgeEndpointPath = `/${string}`

export type BridgeEndpointHandler<
  TPath extends BridgeEndpointPath,
  TResponse extends BridgeEndpointResponse,
> = (params: {
  request: Request
  server: Server
  client: Client
  params: BridgeEndpointParams<TPath>
}) => TResponse

export type BridgeEndpointResponse = {
  data: Record<string, unknown> | undefined
  status: number
}

export type BridgeEndpointParamNames<
  TEndpointPath extends string,
  TParams extends string[] = [],
> = TEndpointPath extends `${string}:${infer TParam}:${infer TRest}`
  ? BridgeEndpointParamNames<TRest, [...TParams, TParam]>
  : TParams

export type BridgeEndpointParams<
  TEndpointPath extends string,
  TEndpointParamName extends
    string = BridgeEndpointParamNames<TEndpointPath>[number],
> = Record<TEndpointParamName, string>
