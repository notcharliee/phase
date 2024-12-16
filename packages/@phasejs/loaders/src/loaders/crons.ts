import { BotCronBuilder } from "@phasejs/builders"

import type { DjsClient } from "@phasejs/core"
import type { BotCron } from "@phasejs/core/client"

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
