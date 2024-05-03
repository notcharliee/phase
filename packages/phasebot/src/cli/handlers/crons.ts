import { Collection } from "discord.js"

import { BotCronBuilder, BotCronExecute } from "~/builders"

import { CronsCollection, PhaseClient } from "../client"

export const handleCrons = (client: PhaseClient) => {
  const crons = Array.from(client.crons.values()).flatMap((event) => event)

  for (const cron of crons) {
    cron.start(client)
  }
}

export const getCrons = async () => {
  const paths = Array.from(
    new Bun.Glob("src/crons/**/*.{js,ts,jsx,tsx}").scanSync({
      absolute: true,
    }),
  ).filter((path) => !/.*(\\|\/)_.*?.(js|ts|jsx|tsx)/.test(path))

  const crons: CronsCollection = new Collection()

  for (const path of paths) {
    const defaultExport = (await import(path).then((m) => m.default)) as unknown

    if (!defaultExport) {
      throw new Error(`Event file '${path}' is missing a default export`)
    }

    let cron: BotCronBuilder | undefined

    if (
      typeof defaultExport === "object" &&
      "metadata" in defaultExport &&
      defaultExport.metadata &&
      typeof defaultExport.metadata === "object" &&
      "type" in defaultExport.metadata &&
      defaultExport.metadata.type === "cron"
    ) {
      cron = defaultExport as BotCronBuilder
    } else if (
      typeof defaultExport === "object" &&
      "cronTime" in defaultExport &&
      typeof defaultExport.cronTime === "string" &&
      "execute" in defaultExport &&
      typeof defaultExport.execute === "function"
    ) {
      const data = {
        cronTime: defaultExport.cronTime as string,
        execute: defaultExport.execute as BotCronExecute,
      }

      cron = new BotCronBuilder()
        .setPattern(data.cronTime)
        .setExecute(data.execute)
    }

    if (!cron) {
      throw new Error(`Cron file '${path}' does not export a valid cron job`)
    }

    if (crons.has(cron.pattern)) {
      const existingCron = crons.get(cron.pattern)!
      if (Array.isArray(existingCron)) {
        existingCron.push(cron)
      } else {
        crons.set(cron.pattern, [existingCron, cron])
      }
    } else {
      crons.set(cron.pattern, cron)
    }
  }

  return crons
}
