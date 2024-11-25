import type { BridgeEndpoint } from "~/structures/BridgeEndpoint"

export type BridgeRouteName<TEndpoint extends BridgeEndpoint> =
  `${TEndpoint["method"]} /v${TEndpoint["version"]}${TEndpoint["path"]}`

export type BridgeRoutes<
  TEndpoints extends BridgeEndpoint[],
  TEndpoint extends BridgeEndpoint = TEndpoints[number],
> = Record<BridgeRouteName<TEndpoint>, TEndpoint["handler"]>
