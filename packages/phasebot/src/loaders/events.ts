import { readdirSync, statSync } from "node:fs"
import { extname, join } from "node:path"

import { validExtnames } from "~/lib/utils"

import { BotEventBuilder } from "~/structures"

import type { BotEventFile } from "~/types/events"
import type { Client } from "discord.js"

export async function loadEventFiles(client: Client, paths: string[]) {
  const eventFiles: BotEventFile[] = []

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

      if (!BotEventBuilder.isBuilder(builder)) {
        console.warn(`File does not export a valid builder: ${path}`)
        continue
      }

      const event = builder.build(client)

      eventFiles.push({ path, event })
    }
  }

  for (const path of paths) {
    await analyseDirectory(path)
  }

  return eventFiles
}