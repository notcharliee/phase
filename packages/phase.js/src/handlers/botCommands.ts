import { existsSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"

import { getAllFiles } from "~/utils/getAllFiles"
import type { BotCommand } from "~/utils/botCommand"

import { Client } from "discord.js"


export const handleBotCommands = async (client: Client<boolean>) => {
  const commands: Record<string, ReturnType<BotCommand>> = {}
  const commandDir = resolve(process.cwd(), "build/commands")

  if (!existsSync(pathToFileURL(commandDir))) return commands

  for (const commandFile of getAllFiles(commandDir)) {
    try {
      const commandFunction: ReturnType<BotCommand> = (await (await import(pathToFileURL(commandFile).toString())).default).default
      commands[commandFunction.name] = commandFunction
    } catch (error) {
      throw error
    }
  }

  if (client.isReady()) updateBotCommands(client, commands)
  else client.once("ready", (readyClient) => { updateBotCommands(readyClient, commands) })

  client.on("interactionCreate", (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = commands[interaction.commandName]
      if (!command) return

      command.execute(
        interaction,
        client as Client<true>,
      ).catch(error => {
        console.log(error)
      })
    }
  })

  return commands
}


/**
 * Fetches the existing commands, then checks if any new commands need to be added or existing commands need to be removed. If so, it updates the commands accordingly.
 */
const updateBotCommands = async (
  client: Client<true>,
  newCommands: Record<string, ReturnType<BotCommand>>,
) => {
  const existingCommands = await client.application.commands.fetch()

  const existingCommandNames = existingCommands.map(command => command.name)
  const newCommandNames = Object.keys(newCommands)

  if (
    !newCommandNames.every(newCommand => existingCommandNames.includes(newCommand)) || // the new commands are missing an existing command
    !existingCommandNames.every(existingCommand => newCommandNames.includes(existingCommand)) // the existing commands are missing new commands
  ) {
    client.application.commands.set(Object.values(newCommands))
  }
}
