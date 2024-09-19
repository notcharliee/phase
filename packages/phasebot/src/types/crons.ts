import type { BotCronBuilder } from "~/builders"

export interface CronFile {
  path: string
  cron: BotCronBuilder
}
