import type { DjsClient } from "~/types/client"

export type BotPrestart = (client: DjsClient<false>) => void | Promise<void>
