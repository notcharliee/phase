import { BridgeClient } from "~/structures/BridgeClient"
import { BridgeServer } from "~/structures/BridgeServer"

import type { BridgeEndpoint } from "~/structures/BridgeEndpoint"

export class Bridge<
  TEndpoints extends BridgeEndpoint[],
  TVersion extends TEndpoints[number]["version"],
> {
  public readonly endpoints: TEndpoints
  public readonly version: TVersion
  public readonly url: string

  public readonly client: BridgeClient<TEndpoints, TVersion>
  public readonly server: BridgeServer<TEndpoints, TVersion>

  private readonly token: string

  constructor(options: {
    endpoints: TEndpoints
    version: TVersion
    url: string
    token: string
  }) {
    this.endpoints = options.endpoints
    this.version = options.version
    this.url = options.url
    this.token = options.token

    this.client = new BridgeClient({
      endpoints: this.endpoints,
      version: this.version,
      url: this.url,
      token: this.token,
    })

    this.server = new BridgeServer({
      endpoints: this.endpoints,
      version: this.version,
      token: this.token,
    })
  }
}
