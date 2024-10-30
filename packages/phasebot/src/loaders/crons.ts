import { readdirSync, statSync } from "node:fs"
import { extname, join } from "node:path"

import { validExtnames } from "~/lib/utils"

import { BotCronBuilder } from "~/structures"

import type { BotCronFile } from "~/types/crons"
import type { Client } from "discord.js"

export async function loadCronFiles(client: Client, paths: string[]) {
  const cronFiles: BotCronFile[] = []

  const analyseDirectory = async (currentDir: string) => {
    const entries = readdirSync(currentDir)

    for (const entry of entries) {
      if (entry.startsWith("_")) continue

      const path = join(currentDir, entry)
      const stats = statSync(path)

      if (stats.isDirectory()) {
        await analyseDirectory(path)
        continue
      }

      if (!validExtnames.includes(extname(entry))) {
        continue
      }

      const exports = await import(path)
      const builder = exports.default

      if (!BotCronBuilder.isBuilder(builder)) {
        console.warn(`File does not export a valid builder: ${path}`)
        continue
      }

      const cron = builder.build(client)

      cronFiles.push({ path, cron })
    }
  }

  for (const path of paths) {
    await analyseDirectory(path)
  }

  return cronFiles
}
