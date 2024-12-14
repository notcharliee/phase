import { BotCommandBuilder, BotSubcommandBuilder } from "@phasejs/core/builders"

import type { DjsClient } from "@phasejs/core"
import type { BotCommand } from "@phasejs/core/client"

export async function loadCommands(client: DjsClient, paths: string[]) {
  const commands: BotCommand[] = []

  for (const path of paths) {
    const exports = (await import(path)) as Record<string, unknown>
    const builder = exports.default

    if (
      !BotCommandBuilder.isBuilder(builder) &&
      !BotSubcommandBuilder.isBuilder(builder)
    ) {
      console.warn(`File does not export a valid builder: ${path}`)
      continue
    }

    const commandParts = path
      .replace(/\\/g, "/") // normalise path (windows)
      .replace(/^.*src\/app(?:\/[^/]+)?\/commands\//g, "") // remove src/app/commands/
      .replace(/\([^)]*\)\//g, "") // remove command groups
      .split("/") // split into parts

    const parentName = commandParts.length > 0 ? commandParts[0] : undefined
    const groupName = commandParts.length > 2 ? commandParts[1] : undefined

    const command = BotSubcommandBuilder.isBuilder(builder)
      ? builder.build(client, { parentName, groupName })
      : builder.build(client)

    commands.push(command)
  }

  return commands
}
