import type { DjsClient } from "~/types/client"
import type { Awaitable } from "~/types/utils"

export interface BotPlugin {
  name: string
  version: `${number}.${number}.${number}`
  onLoad: (client: DjsClient<false>) => Awaitable<void>
}
