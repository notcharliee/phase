import { BaseManager } from "discord.js"

import type { CronFile } from "~/types/crons"
import type { Client } from "discord.js"

export class CronManager extends BaseManager {
  constructor(client: Client, cronFiles: CronFile[]) {
    super(client)

    client.once("ready", async (readyClient) => {
      for (const { cron } of cronFiles) {
        cron.start(readyClient)
      }
    })
  }
}
