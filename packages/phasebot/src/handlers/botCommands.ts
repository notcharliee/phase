import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

import {
  ApplicationCommand,
  ApplicationCommandOptionType,
  Collection,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  type ApplicationCommandOption,
  type Client,
} from "discord.js"

import {
  BotCommandBuilder,
  type BotCommandExecuteFunction,
  type DeprecatedBotCommandFunction,
} from "~/builders/BotCommandBuilder"

import { getAllFiles } from "~/utils/getAllFiles"

export const getBotCommands = async () => {
  const commandCollection = new Collection<string, BotCommandBuilder>()
  const commandDir = resolve(process.cwd(), "build/commands")

  for (const commandFilePath of getAllFiles(commandDir)) {
    if (commandFilePath.endsWith("middleware.js")) continue

    const command = await import(pathToFileURL(commandFilePath).toString())
      .then((module) => module.default ?? null)
      .catch((error) => {
        throw error
      })

    if (command instanceof BotCommandBuilder) {
      commandCollection.set(command.name, command)
    } else {
      const data = command as ReturnType<DeprecatedBotCommandFunction>

      const commandBuilder = new BotCommandBuilder()
        .setName(data.name)
        .setDescription(data.description)

      if (data.name_localizations) {
        commandBuilder.setNameLocalizations(data.name_localizations)
      }

      if (data.description_localizations) {
        commandBuilder.setDescriptionLocalizations(
          data.description_localizations,
        )
      }

      if (data.options && data.options.length) {
        commandBuilder.setOptions(data.options)
      }

      if (data.nsfw) {
        commandBuilder.setNSFW(data.nsfw)
      }

      if (data.dm_permission) {
        commandBuilder.setDMPermission(data.dm_permission)
      }

      if (data.default_member_permissions) {
        commandBuilder.setDefaultMemberPermissions(
          data.default_member_permissions,
        )
      }

      if (data.execute) {
        commandBuilder.setExecute(data.execute)
      }

      commandCollection.set(commandBuilder.name, commandBuilder)
    }
  }

  return commandCollection
}

export const getBotCommandsMiddleware = async () => {
  const commandDir = resolve(process.cwd(), "build/commands")

  const commandMiddleware: BotCommandExecuteFunction | null = await import(
    pathToFileURL(join(commandDir, "middleware.js")).toString()
  )
    .then((module) => module.default ?? null)
    .catch(() => null)

  return commandMiddleware
}

export const sortBotCommandData = (
  commands:
    | RESTPostAPIChatInputApplicationCommandsJSONBody[]
    | ApplicationCommand[],
) => {
  const sortAndReduceKeys = <T extends object>(obj: T) => {
    return Object.keys(obj)
      .sort()
      .reduce(
        (acc, key) => ({
          ...acc,
          [key.replace(/([A-Z])/g, "_$1").toLowerCase()]: obj[key as keyof T],
        }),
        {} as T,
      )
  }

  const sortOptions = (
    options: ApplicationCommandOption[],
  ): ApplicationCommandOption[] => {
    return options.map((option: ApplicationCommandOption) =>
      option.type === ApplicationCommandOptionType.Subcommand ||
      option.type === ApplicationCommandOptionType.SubcommandGroup
        ? sortAndReduceKeys({
            ...option,
            options:
              option.options && option.options.length
                ? sortOptions(option.options as ApplicationCommandOption[])
                : [],
          })
        : sortAndReduceKeys(option),
    ) as ApplicationCommandOption[]
  }

  const sortedCommands = commands
    .map((command) => ({
      name: command.name,

      name_localizations:
        "name_localizations" in command && command.name_localizations
          ? command.name_localizations
          : undefined,

      description: command.description,

      description_localizations:
        "description_localizations" in command &&
        command.description_localizations
          ? command.description_localizations
          : undefined,

      default_member_permissions:
        "default_member_permissions" in command &&
        command.default_member_permissions
          ? command.default_member_permissions
          : undefined,

      dm_permission:
        "dm_permission" in command && command.dm_permission
          ? command.dm_permission
          : undefined,

      nsfw: "nsfw" in command && command.nsfw ? command.nsfw : undefined,

      options: command.options
        ? sortOptions(command.options as ApplicationCommandOption[])
        : undefined,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return sortedCommands as RESTPostAPIChatInputApplicationCommandsJSONBody[]
}

const updateBotCommands = async (
  client: Client<true>,
  newCommands: Collection<string, BotCommandBuilder>,
) => {
  const newCommandData = sortBotCommandData(
    newCommands.map((command) => command.toJSON()),
  )

  const oldCommandData = sortBotCommandData(
    Array.from((await client.application.commands.fetch()).values()),
  )

  if (
    JSON.stringify(newCommandData, null, 2) !==
    JSON.stringify(oldCommandData, null, 2)
  ) {
    client.application.commands.set(
      newCommands.map((command) => command.toJSON()),
    )
  }
}

export const handleBotCommands = async (client: Client) => {
  const commands = await getBotCommands()
  const middleware = await getBotCommandsMiddleware()

  if (client.isReady()) {
    updateBotCommands(client, commands)
  } else {
    client.once("ready", (readyClient) => {
      updateBotCommands(readyClient, commands)
    })
  }

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName)
      if (!command || !command.execute) return

      try {
        if (middleware) {
          const middlewareRes = await middleware(
            client as Client<true>,
            interaction,
          )
          if (!Boolean(middlewareRes)) return
        }

        await command.execute(interaction.client, interaction)
      } catch (error) {
        console.log(error)
      }
    }
  })
}
