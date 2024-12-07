import { readdirSync, statSync } from "node:fs"
import { extname, join } from "node:path"

import { validExtnames } from "~/utils/constants"

import { BotCommandBuilder } from "~/builders/BotCommandBuilder"
import { BotSubcommandBuilder } from "~/builders/BotSubcommandBuilder"

import type { DjsClient } from "~/types/client"
import type { BotCommandFile } from "~/types/commands"

export async function loadCommandFiles(client: DjsClient, paths: string[]) {
  const commandFiles: BotCommandFile[] = []

  const analyseDirectory = async (currentDir: string, prefix = "") => {
    const entries = readdirSync(currentDir)

    for (const entry of entries) {
      if (entry.startsWith("_")) continue

      const path = join(currentDir, entry)
      const stats = statSync(path)

      if (stats.isDirectory()) {
        const isGroup = entry.startsWith("(") && entry.endsWith(")")
        await analyseDirectory(path, `${prefix}${isGroup ? "" : `${entry}/`}`)
      }

      if (!validExtnames.includes(extname(entry))) {
        continue
      }

      const exports = (await import(path)) as Record<string, unknown>
      const builder = exports.default

      if (
        !BotCommandBuilder.isBuilder(builder) &&
        !BotSubcommandBuilder.isBuilder(builder)
      ) {
        console.warn(`File does not export a valid builder: ${path}`)
        continue
      }

      // replace slashes, parentheses, and underscores with spaces, then split by spaces
      const commandParts = prefix
        .replace(/[\\/()_]/g, " ")
        .split(" ")
        .filter(Boolean)

      const parentName = commandParts.length > 0 ? commandParts[0] : undefined
      const groupName = commandParts.length > 1 ? commandParts[1] : undefined

      const command = BotSubcommandBuilder.isBuilder(builder)
        ? builder.build(client, { parentName, groupName })
        : builder.build(client)

      commandFiles.push({ path, command })
    }
  }

  for (const path of paths) {
    await analyseDirectory(path)
  }

  return commandFiles
}
