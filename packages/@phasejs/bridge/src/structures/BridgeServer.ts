import { BotPluginBuilder } from "@phasejs/plugin"

import type { BotPlugin } from "@phasejs/plugin"
import type { BridgeEndpoint } from "~/structures/BridgeEndpoint"
import type { BridgeRouteName, BridgeRoutes } from "~/types/routes"
import type { Client } from "discord.js"

export class BridgeServer<
  TEndpoints extends BridgeEndpoint[],
  TVersion extends TEndpoints[number]["version"],
> {
  public readonly endpoints: TEndpoints
  public readonly version: TVersion
  public readonly routes: BridgeRoutes<TEndpoints>
  public readonly plugin: BotPlugin

  private readonly token: string

  constructor(params: {
    endpoints: TEndpoints
    version: TVersion
    token: string
  }) {
    this.endpoints = params.endpoints
    this.version = params.version
    this.token = params.token

    this.routes = this.createRoutes()
    this.plugin = this.createPlugin()
  }

  private createRoutes(): BridgeRoutes<TEndpoints> {
    return this.endpoints.reduce((routes, endpoint) => {
      const routeName: BridgeRouteName<TEndpoints[number]> =
        `${endpoint.method} /v${endpoint.version}${endpoint.path}`

      routes[routeName] = endpoint.handler
      return routes
    }, {} as BridgeRoutes<TEndpoints>)
  }

  private createServer(client: Client) {
    type RouteNameWithMethod = BridgeRouteName<TEndpoints[number]>

    const isValidRouteName = (
      routeName: string,
    ): routeName is RouteNameWithMethod => {
      return routeName in this.routes
    }

    Bun.serve({
      port: 4000,
      fetch: (request, server) => {
        // validate auth token

        const url = new URL(request.url)
        const headers = new Headers(request.headers)

        const authHeader = headers.get("Authorization")
        const authToken = authHeader?.split(" ")[1]

        if (authToken !== this.token)
          return new Response("Unauthorized", { status: 401 })

        // find route

        const routeName = `${request.method} ${url.pathname}` // to fix: wont work with params

        if (!isValidRouteName(routeName))
          return new Response("Not found", { status: 404 })

        const routeHandler = this.routes[routeName]

        // execute route handler

        const response = routeHandler({
          client,
          request,
          server,
          params: {}, // to impliment
        })

        // return response

        return new Response(
          response.data !== undefined
            ? JSON.stringify(response.data, null, 2)
            : undefined,
          { status: response.status },
        )
      },
    })
  }

  private createPlugin(): BotPlugin {
    const pluginBuilder = new BotPluginBuilder()
      .setName("Bridge")
      .setVersion("0.1.0")
      .setOnLoad((bot) => {
        if (bot.isReady()) this.createServer(bot)
        else bot.once("ready", () => this.createServer(bot))
      })

    return pluginBuilder.build()
  }
}
