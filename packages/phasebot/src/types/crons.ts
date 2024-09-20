import type { BotCronBuilder } from "~/structures/builders/BotCronBuilder"
import type { Client } from "discord.js"

export type BotCronExecute = (client: Client<true>) => void | Promise<void>

export interface CronFile {
  path: string
  cron: BotCronBuilder
}
