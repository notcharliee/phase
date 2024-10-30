import type { BotCron } from "~/structures"
import type { Client } from "discord.js"

export type BotCronPattern = string
export type BotCronMetadata = { type: "cron"; [key: string]: unknown }
export type BotCronExecute = (client: Client<true>) => void | Promise<void>

export interface BotCronFile {
  path: string
  cron: BotCron
}
