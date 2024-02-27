import { existsSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"

import type { BotCommand } from "~/utils/botCommand"
import { getAllFiles } from "~/utils/getAllFiles"

import {
  type Client,
  type APIApplicationCommandOption,
  type ApplicationCommandOption,
  type APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
  ApplicationCommandDataResolvable,
} from "discord.js"

import type { AddUndefinedToPossiblyUndefinedPropertiesOfInterface } from "node_modules/discord-api-types/utils/internals"

export const handleBotCommands = async (client: Client<boolean>) => {
  const commands: Record<string, ReturnType<BotCommand>> = {}
  const commandDir = resolve(process.cwd(), "build/commands")

  if (!existsSync(pathToFileURL(commandDir))) return commands

  for (const commandFile of getAllFiles(commandDir)) {
    try {
      const commandFunction: ReturnType<BotCommand> = await (
        await import(pathToFileURL(commandFile).toString())
      ).default
      commands[commandFunction.name] = commandFunction
    } catch (error) {
      throw error
    }
  }

  if (client.isReady()) updateBotCommands(client, commands)
  else
    client.once("ready", (readyClient) => {
      updateBotCommands(readyClient, commands)
    })

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = commands[interaction.commandName]
      if (!command) return

      try {
        await command.execute(client as Client<true>, interaction)
      } catch (error) {
        console.log(error)
      }
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
  const newCommandsData = Object.entries(newCommands)
    .map(([name, command]) => ({
      name,
      description: command.description,
      options: command.options?.map(getOptions) ?? [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const existingCommandsData = (await client.application.commands.fetch())
    .map((command) => ({
      name: command.name,
      description: command.description,
      options: command.options.map(getOptions),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (
    JSON.stringify(newCommandsData, null, 2) !==
    JSON.stringify(existingCommandsData, null, 2)
  ) {
    client.application.commands.set(
      Object.values(newCommands) as ApplicationCommandDataResolvable[],
    )
  }
}

function getOptions(
  commandOption:
    | APIApplicationCommandSubcommandOption
    | ApplicationCommandOption
    | AddUndefinedToPossiblyUndefinedPropertiesOfInterface<APIApplicationCommandOption>,
) {
  const { name, description, type } = commandOption

  if (type === ApplicationCommandOptionType.SubcommandGroup) {
    return {
      name,
      description,
      type,
      options:
        commandOption.options
          ?.map((subcommandOption) => ({
            name: subcommandOption.name,
            description: subcommandOption.description,
            type: subcommandOption.type,
            options:
              subcommandOption.options
                ?.map((option) => ({
                  name: option.name,
                  description: option.description,
                  type: option.type,
                  required: option.required,
                }))
                .sort((a, b) => a.name.localeCompare(b.name)) || [],
          }))
          .sort((a, b) => a.name.localeCompare(b.name)) || [],
    }
  }

  if (type === ApplicationCommandOptionType.Subcommand) {
    return {
      name,
      description,
      type,
      options:
        commandOption.options
          ?.map((option) => ({
            name: option.name,
            description: option.description,
            type: option.type,
            required: option.required,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)) || [],
    }
  }

  return {
    name,
    description,
    type,
    required: commandOption.required,
  }
}
