import type { Client } from "discord.js"

export interface BotCronJob {
  (
    cronTime: string,
    execute: (client: Client<true>) => any
  ): {
    cronTime: string,
    execute: (client: Client<true>) => any
  }
}

export const botCronJob: BotCronJob = (cronTime, execute) => ({
  cronTime,
  execute,
})
