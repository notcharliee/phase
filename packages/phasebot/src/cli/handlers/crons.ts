import { Client, Collection } from "discord.js"

import { BotCronBuilder } from "~/builders"

export type CronsCollection = Collection<string, BotCronBuilder[]>

export const getCronPaths = () => {
  const dir = Bun.env.NODE_ENV !== "production" ? "src" : ".phase"

  return Array.from(
    new Bun.Glob(`${dir}/crons/**/*.{js,ts,jsx,tsx}`).scanSync({
      absolute: true,
    }),
  )
}

export const handleCrons = async (
  client: Client<false>,
  crons?: CronsCollection,
) => {
  // if no crons collection is provided, load all cron files
  if (!crons) {
    const paths = getCronPaths()

    crons = new Collection()

    for (const path of paths) {
      const defaultExport = (await import(path).then(
        (m) => m.default,
      )) as unknown

      if (!defaultExport) {
        throw new Error(`Cron file '${path}' is missing a default export`)
      } else if (
        !(
          typeof defaultExport === "object" &&
          "metadata" in defaultExport &&
          defaultExport.metadata &&
          typeof defaultExport.metadata === "object" &&
          "type" in defaultExport.metadata &&
          defaultExport.metadata.type === "cron"
        )
      ) {
        throw new Error(`Cron file '${path}' does not export a valid cron job`)
      }

      const cron = defaultExport as BotCronBuilder
      crons.set(cron.pattern, [...(crons.get(cron.pattern) ?? []), cron])
    }
  }

  // setup all crons once client is ready
  client.once("ready", async (readyClient) => {
    for (const cron of Array.from(crons.values()).flat()) {
      cron.start(readyClient)
    }
  })
}
