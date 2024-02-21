import type { Client } from "discord.js"

export interface CronJob {
  (
    cronTime: string,
    execute: (client: Client<true>) => any
  ): {
    cronTime: string,
    execute: (client: Client<true>) => any
  }
}

export const cronJob: CronJob = (cronTime, execute) => ({
  cronTime,
  execute,
})
