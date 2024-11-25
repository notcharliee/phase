import type {
  BridgeEndpointHandler,
  BridgeEndpointMethod,
  BridgeEndpointPath,
  BridgeEndpointResponse,
  BridgeEndpointVersion,
} from "~/types/endpoints"

export class BridgeEndpoint<
  TMethod extends BridgeEndpointMethod = BridgeEndpointMethod,
  TVersion extends BridgeEndpointVersion = BridgeEndpointVersion,
  TPath extends BridgeEndpointPath = BridgeEndpointPath,
  TResponse extends BridgeEndpointResponse = BridgeEndpointResponse,
> {
  public readonly method: TMethod
  public readonly version: TVersion
  public readonly path: TPath
  public readonly handler: BridgeEndpointHandler<TPath, TResponse>

  constructor(endpoint: {
    method: TMethod
    version: TVersion
    path: TPath
    handler: BridgeEndpointHandler<TPath, TResponse>
  }) {
    this.method = endpoint.method
    this.version = endpoint.version
    this.path = endpoint.path
    this.handler = endpoint.handler
  }
}
