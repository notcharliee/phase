import type { BotCron } from "~/structures/BotCron"
import type { DjsClient } from "~/types/client"

export type BotCronPattern = string
export type BotCronMetadata = { type: "cron"; [key: string]: unknown }
export type BotCronExecute = (client: DjsClient<true>) => void | Promise<void>

export interface BotCronFile {
  path: string
  cron: BotCron
}
