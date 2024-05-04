import {
  APIApplicationCommandOption,
  ApplicationCommandOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Collection,
  InteractionType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js"

import cloneDeep from "lodash.clonedeep"

import {
  BotCommandBuilder,
  type DeprecatedBotCommandFunction,
} from "~/builders"

import { CommandsCollection, PhaseClient } from "../client"

export const handleCommands = (client: PhaseClient) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.type !== InteractionType.ApplicationCommand) return
    if (interaction.commandType !== ApplicationCommandType.ChatInput) return

    const command = client.commands.get(interaction.commandName)!
    const middleware = client.middleware
    const execute = command.execute

    if (command) {
      try {
        if (middleware) {
          await middleware(client, interaction, execute)
        } else {
          await execute(client, interaction)
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      client.application?.commands.delete(interaction.commandName).catch(() => {
        console.error(
          new Error(
            `Failed to remove unknown application command '${interaction.commandName}'`,
          ),
        )
      })
    }
  })
}

export const getCommands = async () => {
  const paths = Array.from(
    new Bun.Glob("src/commands/**/*.{js,ts,jsx,tsx}").scanSync({
      absolute: true,
    }),
  ).filter((path) => !/.*(\\|\/)(middleware|_.*?).(js|ts|jsx|tsx)/.test(path))

  const commands: CommandsCollection = new Collection()

  for (const path of paths) {
    const defaultExport = (await import(path).then((m) => m.default)) as unknown

    if (!defaultExport) {
      throw new Error(`Command file '${path}' is missing a default export`)
    }

    if (
      typeof defaultExport === "object" &&
      "metadata" in defaultExport &&
      defaultExport.metadata &&
      typeof defaultExport.metadata === "object" &&
      "type" in defaultExport.metadata &&
      defaultExport.metadata.type === "command"
    ) {
      const data = defaultExport as BotCommandBuilder
      commands.set(data.name, data)
    } else if (
      typeof defaultExport === "object" &&
      "name" in defaultExport &&
      "description" in defaultExport &&
      "execute" in defaultExport
    ) {
      const data = defaultExport as ReturnType<DeprecatedBotCommandFunction>

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

      commands.set(commandBuilder.name, commandBuilder)
    }
  }

  return commands
}

export const updateCommands = async (client: PhaseClient) => {
  /**
   * A function that sorts and renames keys to always be in the same order and type case.
   */
  const sortKeys = <T extends object>(obj: T) => {
    return Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .reduce(
        (acc, key) => ({
          ...acc,
          [key.replace(/([A-Z])/g, "_$1").toLowerCase()]: obj[key as keyof T],
        }),
        {} as T,
      )
  }

  /**
   * A function that sorts the options array of a command recursively.
   */
  const sortOptions = (
    options: APIApplicationCommandOption[],
  ): APIApplicationCommandOption[] => {
    return options.map((option: APIApplicationCommandOption) =>
      option.type === ApplicationCommandOptionType.Subcommand ||
      option.type === ApplicationCommandOptionType.SubcommandGroup
        ? sortKeys({
            ...option,
            options:
              option.options && option.options.length
                ? sortOptions(option.options)
                : [],
          })
        : sortKeys(option),
    ) as APIApplicationCommandOption[]
  }

  type ApplicationCommandsJSON =
    RESTPostAPIChatInputApplicationCommandsJSONBody & {
      execute: undefined
      metadata: undefined
    }

  const liveCommands = await client.application!.commands.fetch()

  const newCommands = cloneDeep(client.commands)
    .map((data) => {
      data.setOptions(
        sortOptions(data.options.map((option) => option.toJSON())),
      )

      return sortKeys({
        ...data.toJSON(),
        execute: undefined,
        metadata: undefined,
      } satisfies ApplicationCommandsJSON)
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const oldCommands = cloneDeep(liveCommands)
    .filter((data) => data.type === ApplicationCommandType.ChatInput)
    .map((data) =>
      sortKeys({
        name: data.name,
        description: data.description,
        name_localizations: data.nameLocalizations ?? undefined,
        description_localizations: data.descriptionLocalizations ?? undefined,
        options: sortOptions(data.options as APIApplicationCommandOption[]),
        nsfw: data.nsfw === true ? true : undefined,
        dm_permission: data.dmPermission === false ? false : undefined,
        default_member_permissions: data.defaultMemberPermissions?.toJSON(),
        execute: undefined,
        metadata: undefined,
      } satisfies ApplicationCommandsJSON),
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  // if no commands have been set, set them all
  if (!liveCommands?.size) {
    client.application?.commands.set(newCommands)

    return {
      created: newCommands,
      deleted: [],
      updated: [],
    }
  }

  const commandsToDelete = Array.from(
    oldCommands
      .filter(
        (oldCommand) =>
          !newCommands.find(
            (newCommand) => newCommand.name === oldCommand.name,
          ),
      )
      .values(),
  )

  const commandsToCreate = Array.from(
    newCommands
      .filter(
        (newCommand) =>
          !oldCommands.find(
            (oldCommand) => oldCommand.name === newCommand.name,
          ),
      )
      .values(),
  )

  const commandsToUpdate: ApplicationCommandsJSON[] = []

  oldCommands.forEach((oldCommand) => {
    const newCommand = newCommands.find(
      (newCommand) => newCommand.name === oldCommand.name,
    )

    if (newCommand) {
      const oldCommandJSON = JSON.stringify(oldCommand, null, 2)
      const newCommandJSON = JSON.stringify(newCommand, null, 2)

      if (oldCommandJSON !== newCommandJSON) {
        commandsToUpdate.push(newCommand)
      }
    }
  })

  // delete commands
  for (const command of commandsToDelete) {
    await client.application?.commands.delete(
      liveCommands.find((data) => data.name === command.name)!.id,
    )
  }

  // create commands
  for (const command of commandsToCreate) {
    await client.application?.commands.create(command)
  }

  // update commands
  for (const command of commandsToUpdate) {
    await client.application?.commands.edit(
      liveCommands.find((data) => data.name === command.name)!.id,
      command,
    )
  }

  return {
    created: commandsToCreate,
    deleted: commandsToDelete,
    updated: commandsToUpdate,
  }
}
