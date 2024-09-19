import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Collection,
  SlashCommandAssertions,
} from "discord.js"

import chalk from "chalk"
import cloneDeep from "lodash.clonedeep"

import { BotCommandBuilder } from "~/builders"
import { spinner } from "~/utils"

import type { BotCommandExecute, BotCommandMiddleware } from "~/builders"
import type { CommandFile } from "~/types/commands"
import type {
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandGroupOption,
  Client,
} from "discord.js"

function isSubcommand(file: CommandFile) {
  return "parent" in file
}

export const handleCommands = async (
  client: Client<false>,
  commandFiles: CommandFile[],
  commandMiddleware: BotCommandMiddleware | undefined,
) => {
  // the json commands that will be sent to the API
  const apiCommands = new Collection<
    string,
    ReturnType<BotCommandBuilder["toJSON"]>
  >()

  // the partial commands that will be used for interaction events
  const partialCommands = new Collection<
    string,
    { name: string; execute: BotCommandExecute; metadata: object }
  >()

  for (const file of commandFiles) {
    partialCommands.set(file.name, {
      name: file.name,
      metadata: file.command.metadata,
      execute: file.command.execute,
    })

    if (isSubcommand(file)) {
      let existingApiCommand = apiCommands.get(file.parent)

      if (!existingApiCommand) {
        apiCommands.set(file.parent, {
          name: file.parent,
          description: file.parent,
          options: [],
        })

        existingApiCommand = apiCommands.get(file.parent)!
      }

      if (!existingApiCommand.options) existingApiCommand.options = []

      if (file.group) {
        const existingGroup = existingApiCommand.options.find(
          (option) =>
            option.name === file.group &&
            option.type === ApplicationCommandOptionType.SubcommandGroup,
        ) as APIApplicationCommandSubcommandGroupOption | undefined

        if (!existingGroup) {
          SlashCommandAssertions.validateMaxOptionsLength(
            existingApiCommand.options,
          )

          existingApiCommand.options.push({
            name: file.group,
            description: file.group,
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [file.command.toJSON()],
          })
        } else {
          SlashCommandAssertions.validateMaxOptionsLength(existingGroup.options)

          existingGroup.options.push(file.command.toJSON())
        }
      } else {
        SlashCommandAssertions.validateMaxOptionsLength(
          existingApiCommand.options,
        )

        existingApiCommand.options.push(file.command.toJSON())
      }
    } else {
      apiCommands.set(file.command.name, file.command.toJSON())
    }
  }

  // update commands once client is ready
  client.once("ready", async (readyClient) => {
    const liveCommands = (
      await readyClient.application.commands.fetch()
    ).filter(({ type }) => type === ApplicationCommandType.ChatInput)

    // finds the id of a live command from its name
    const findCommandId = (name: string) => {
      return liveCommands.find((data) => data.name === name)?.id
    }

    // sorts and renames keys to always be in the same order and type case
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

    // sorts the options array of a command recursively
    const sortOptions = (
      options: APIApplicationCommandOption[],
    ): APIApplicationCommandOption[] => {
      return options
        .map((option: APIApplicationCommandOption) =>
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
        )
        .sort((a, b) =>
          (a.type === ApplicationCommandOptionType.Subcommand ||
            a.type === ApplicationCommandOptionType.SubcommandGroup) &&
          (b.type === ApplicationCommandOptionType.Subcommand ||
            b.type === ApplicationCommandOptionType.SubcommandGroup)
            ? a.name.localeCompare(b.name)
            : 0,
        ) as APIApplicationCommandOption[]
    }

    // clone the local commands, convert them to their json form, and sort them
    const newCommands = cloneDeep(apiCommands)
      .map((data) => {
        if (data.nsfw === undefined) data.nsfw = false
        if (data.dm_permission === undefined) data.dm_permission = true

        return sortKeys({
          ...data,
          options: data.options?.length ? sortOptions(data.options) : [],
          execute: undefined,
          metadata: undefined,
        })
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    // clone the live commands, convert them into snake_case, and sort them
    const oldCommands = cloneDeep(liveCommands)
      .map((data) =>
        sortKeys({
          name: data.name,
          description: data.description,
          name_localizations: data.nameLocalizations ?? undefined,
          description_localizations: data.descriptionLocalizations ?? undefined,
          options: sortOptions(data.options as APIApplicationCommandOption[]),
          nsfw: data.nsfw,
          dm_permission: data.dmPermission,
          default_member_permissions: data.defaultMemberPermissions?.toJSON(),
        }),
      )
      .sort((a, b) => a.name.localeCompare(b.name))

    // if no commands have been set, set them all and return
    if (!oldCommands.length) {
      const cliSpinner = spinner("Setting up slash commands ...").start()

      await readyClient.application.commands.set(newCommands)

      cliSpinner.succeed("Slash commands are live!")

      return
    }

    // find the commands that don't exist in the live commands
    const commandsToCreate = newCommands.filter(
      (newCommand) =>
        !oldCommands.find((oldCommand) => oldCommand.name === newCommand.name),
    )

    // find the commands that only exist in the live commands
    const commandsToDelete = oldCommands.filter(
      (oldCommand) =>
        !newCommands.find((newCommand) => newCommand.name === oldCommand.name),
    )

    // find the commands that exist in both the live commands and the new commands but have differences
    const commandsToUpdate = newCommands.filter((newCommand) => {
      const oldCommand = oldCommands.find(
        (oldCommand) => oldCommand.name === newCommand.name,
      )

      const oldJSON = JSON.stringify(oldCommand)
      const newJSON = JSON.stringify(newCommand)

      return oldCommand && oldJSON !== newJSON
    })

    // create, delete, and update commands as needed
    if (
      commandsToCreate.length ||
      commandsToDelete.length ||
      commandsToUpdate.length
    ) {
      const commandNames = new Array<string>().concat(
        commandsToCreate.map((cmd) =>
          chalk.grey(`  ${chalk.redBright("+")} /${cmd.name}`),
        ),
        commandsToDelete.map((cmd) =>
          chalk.grey(`  ${chalk.redBright("-")} /${cmd.name}`),
        ),
        commandsToUpdate.map((cmd) =>
          chalk.grey(`  ${chalk.yellowBright("~")} /${cmd.name}`),
        ),
      )

      const cliSpinner = spinner(
        `Updating ${commandNames.length} live slash commands ...`,
      ).start()

      await Promise.all([
        ...commandsToCreate.map((cmd) =>
          readyClient.application.commands.create(cmd),
        ),
        ...commandsToDelete.map((cmd) =>
          readyClient.application.commands.delete(findCommandId(cmd.name)!),
        ),
        ...commandsToUpdate.map((cmd) =>
          readyClient.application.commands.edit(findCommandId(cmd.name)!, cmd),
        ),
      ])

      cliSpinner.succeed("The following live slash commands were updated:")
      console.log(commandNames.join("\n") + "\n")
    }
  })

  // setup the command interaction handler
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const commandName = [
      interaction.commandName,
      interaction.options.getSubcommandGroup(false),
      interaction.options.getSubcommand(false),
    ]
      .filter(Boolean)
      .join(" ")
      .trim()

    const command = partialCommands.get(commandName)
    if (!command) return

    try {
      if (commandMiddleware) {
        await commandMiddleware(interaction, command.execute, command.metadata)
      } else {
        await command.execute(interaction)
      }
    } catch (error) {
      console.error(`Command '${command.name}' failed:`)
      console.error(error)
    }
  })
}
