import { BotCronBuilder } from "~/builders/BotCronBuilder"

import type { BotCron } from "~/structures/BotCron"
import type { DjsClient } from "~/types/client"

export async function loadCrons(client: DjsClient, paths: string[]) {
  const crons: BotCron[] = []

  for (const path of paths) {
    const exports = (await import(path)) as Record<string, unknown>
    const builder = exports.default

    if (!BotCronBuilder.isBuilder(builder)) {
      console.warn(`File does not export a valid builder: ${path}`)
      continue
    }

    const cron = builder.build(client)
    crons.push(cron)
  }

  return crons
}
