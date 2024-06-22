import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Collection,
  InteractionType,
} from "discord.js"

import chalk from "chalk"
import cloneDeep from "lodash.clonedeep"

import { BotCommandBuilder } from "~/builders"
import { getMiddleware, loadingMessage } from "~/cli/utils"

import type { BotCommandMiddleware } from "~/builders"
import type { APIApplicationCommandOption, Client } from "discord.js"

export type CommandsCollection = Collection<string, BotCommandBuilder>

export const getCommandPaths = (dir: string = "src") => {
  return Array.from(
    new Bun.Glob(`${dir}/commands/**/*.{js,ts,jsx,tsx}`).scanSync({
      absolute: true,
    }),
  )
}

export const handleCommands = async (
  client: Client<false>,
  commands?: CommandsCollection,
  middleware?: BotCommandMiddleware,
) => {
  // if no commands collection is provided, load all command files
  if (!commands) {
    const paths = getCommandPaths()

    commands = new Collection()

    for (const path of paths) {
      const defaultExport = (await import(path).then(
        (m) => m.default,
      )) as unknown

      if (!defaultExport) {
        throw new Error(`Command file '${path}' is missing a default export`)
      } else if (
        !(
          typeof defaultExport === "object" &&
          "metadata" in defaultExport &&
          defaultExport.metadata &&
          typeof defaultExport.metadata === "object" &&
          "type" in defaultExport.metadata &&
          defaultExport.metadata.type === "command"
        )
      ) {
        throw new Error(
          `Command file '${path}' does not export a valid command builder`,
        )
      }

      const command = defaultExport as BotCommandBuilder
      commands.set(command.name, command)
    }
  }

  // if no middleware is provided, get the middleware function
  if (!middleware) middleware = await getMiddleware()

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

    // clone the local commands, convert them to their json form, and sort them
    const newCommands = cloneDeep(commands)
      .map((data) => {
        const json = data.toJSON()

        if (json.nsfw === undefined) json.nsfw = false
        if (json.dm_permission === undefined) json.dm_permission = true

        return sortKeys({
          ...json,
          options: json.options?.length ? sortOptions(json.options) : [],
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
      await readyClient.application.commands.set(newCommands)
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
      loadingMessage(
        () =>
          Promise.all([
            ...commandsToCreate.map((cmd) =>
              readyClient.application.commands.create(cmd),
            ),
            ...commandsToDelete.map((cmd) =>
              readyClient.application.commands.delete(findCommandId(cmd.name)!),
            ),
            ...commandsToUpdate.map((cmd) =>
              readyClient.application.commands.edit(
                findCommandId(cmd.name)!,
                cmd,
              ),
            ),
          ]),
        {
          loading: chalk.yellow(
            "Found outdated slash commands. Updating them now ...",
          ),
          success: "Slash commands updated!",
          error: "An error occurred while updating slash commands:\n",
        },
        {
          loading: chalk.yellow("⚠"),
        },
      )
    }
  })

  // setup the command interaction handler
  client.on("interactionCreate", async (interaction) => {
    if (interaction.type !== InteractionType.ApplicationCommand) return
    if (interaction.commandType !== ApplicationCommandType.ChatInput) return

    const command = commands.get(interaction.commandName)
    if (!command) return

    try {
      if (middleware) {
        await middleware(interaction, command.execute)
      } else {
        await command.execute(interaction)
      }
    } catch (error) {
      console.error(new Error(`Command '${command.name}' failed:`))
      console.error(error)
    }
  })
}
