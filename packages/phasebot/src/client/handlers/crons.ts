import { readdirSync, statSync } from "node:fs"
import { extname, join } from "node:path"

import { Client, Collection } from "discord.js"

import { BotCronBuilder } from "~/builders"

export type CronsCollection = Collection<string, BotCronBuilder[]>

interface CronFile {
  path: string
  cron: BotCronBuilder
}

export const getCronFiles = async () => {
  const cronFiles: CronFile[] = []

  const processDir = async (currentDir: string) => {
    const entries = readdirSync(currentDir)

    for (const entry of entries) {
      if (entry.startsWith("_")) continue

      const path = join(currentDir, entry)
      const stats = statSync(path)

      if (stats.isDirectory()) {
        await processDir(path)
      } else if ([".ts", ".tsx", ".js", ".jsx"].includes(extname(entry))) {
        const file = await import(join(process.cwd(), path))
        const defaultExport = file.default as unknown

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
          throw new Error(
            `Cron file '${path}' does not export a valid cron builder`,
          )
        }

        const cron = defaultExport as BotCronBuilder

        cronFiles.push({ path, cron })
      }
    }
  }

  await processDir("src/crons")

  return cronFiles
}

export const handleCrons = async (
  client: Client<false>,
  crons?: CronsCollection,
) => {
  if (!crons) {
    const cronFiles = await getCronFiles()

    crons = new Collection()

    for (const file of cronFiles) {
      crons.set(file.cron.pattern, [
        ...(crons.get(file.cron.pattern) ?? []),
        file.cron,
      ])
    }
  }

  // setup all crons once client is ready
  client.once("ready", async (readyClient) => {
    for (const cron of Array.from(crons.values()).flat()) {
      cron.start(readyClient)
    }
  })
}
