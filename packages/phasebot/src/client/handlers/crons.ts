import type { CronFile } from "~/types/crons"
import type { Client } from "discord.js"

export const handleCrons = async (
  client: Client<false>,
  cronFiles: CronFile[],
) => {
  client.once("ready", async (readyClient) => {
    for (const { cron } of cronFiles) {
      cron.start(readyClient)
    }
  })
}
