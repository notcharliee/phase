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

  // fetch the commands from the discord api
  const fetchedCommands = await client.application!.commands.fetch()

  // do a bunch of stuff to put the commands in a unified format
  const existingCommands = new Collection(
    Array.from(fetchedCommands.values())
      .filter((data) => data.type === ApplicationCommandType.ChatInput)
      .map((data) => {
        const commandBuilder = new BotCommandBuilder()
          .setName(data.name)
          .setDescription(data.description)
          .setExecute(() => {})
          .setMetadata({ type: undefined })

        if (data.nameLocalizations) {
          commandBuilder.setNameLocalizations(data.nameLocalizations)
        }

        if (data.descriptionLocalizations) {
          commandBuilder.setDescriptionLocalizations(
            data.descriptionLocalizations,
          )
        }

        if (data.options && data.options.length) {
          commandBuilder.setOptions(
            sortOptions(data.options) as APIApplicationCommandOption[],
          )
        }

        if (data.nsfw) {
          commandBuilder.setNSFW(data.nsfw)
        }

        if (data.dmPermission === false) {
          commandBuilder.setDMPermission(data.dmPermission)
        }

        if (data.defaultMemberPermissions) {
          commandBuilder.setDefaultMemberPermissions(
            data.defaultMemberPermissions.toJSON(),
          )
        }

        return sortAndReduceKeys(commandBuilder.toJSON())
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((value) => [value.name, value]),
  ).sort((a, b) => a.name.localeCompare(b.name))

  const newCommands = cloneDeep(client.commands)
    .mapValues((data) =>
      sortAndReduceKeys(
        data
          .setExecute(() => {})
          .setMetadata({ type: undefined })
          .setOptions(
            sortOptions(
              data.options.map((option) => option.toJSON()),
            ) as APIApplicationCommandOption[],
          )
          .toJSON(),
      ),
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  // if no commands have been set, create them all
  if (!existingCommands?.size) {
    const commandsToCreate = Array.from(newCommands.values())

    client.application?.commands.set(commandsToCreate)

    return {
      created: commandsToCreate,
      deleted: [],
      updated: [],
    }
  }

  const commandsToDelete = Array.from(
    existingCommands
      .filter((existingCommand) => !newCommands.has(existingCommand.name))
      .values(),
  )

  const commandsToCreate = Array.from(
    newCommands
      .filter((newCommand) => !existingCommands.has(newCommand.name))
      .values(),
  )

  const commandsToUpdate: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []

  existingCommands.forEach((existingCommand) => {
    const newCommand = newCommands.get(existingCommand.name)
    if (newCommand) {
      const existingCommandJSON = JSON.stringify(existingCommand, null, 2)
      const newCommandJSON = JSON.stringify(newCommand, null, 2)
      if (existingCommandJSON !== newCommandJSON) {
        commandsToUpdate.push(newCommand)
      }
    }
  })

  // delete commands
  for (const command of commandsToDelete) {
    await client.application?.commands.delete(
      fetchedCommands.find((data) => data.name === command.name)!.id,
    )
  }

  // create commands
  for (const command of commandsToCreate) {
    await client.application?.commands.create(command)
  }

  // update commands
  for (const command of commandsToUpdate) {
    await client.application?.commands.edit(command.name, command)
  }

  return {
    created: commandsToCreate,
    deleted: commandsToDelete,
    updated: commandsToUpdate,
  }
}
