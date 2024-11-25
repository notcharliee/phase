import type { BridgeEndpoint } from "~/structures/BridgeEndpoint"
import type { BridgeEndpointParams } from "~/types/endpoints"

export class BridgeClient<
  TEndpoints extends BridgeEndpoint[],
  TVersion extends TEndpoints[number]["version"],
> {
  public readonly endpoints: TEndpoints
  public readonly version: TVersion
  public readonly url: string

  private readonly token: string

  constructor(params: {
    endpoints: TEndpoints
    version: TVersion
    url: string
    token: string
  }) {
    this.endpoints = params.endpoints
    this.version = params.version
    this.url = params.url
    this.token = params.token
  }

  async get<
    TPath extends TEndpoints[number]["path"],
    TEndpoint extends TEndpoints[number] = Extract<
      TEndpoints[number],
      { path: TPath }
    >,
  >(path: TPath, params: BridgeEndpointParams<TPath>) {
    const endpoint = path.replace(
      /:[a-zA-Z0-9]+/g,
      (param) => params[param as keyof typeof params],
    )

    const url = new URL(`${this.url}/v${this.version}${endpoint}`)
    const headers = new Headers({ Authorization: `Bearer ${this.token}` })

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const json = await response.json()
      return json as ReturnType<TEndpoint["handler"]>["data"]
    } catch (error) {
      throw new Error(`Failed to fetch data from endpoint: ${error as Error}`)
    }
  }
}
