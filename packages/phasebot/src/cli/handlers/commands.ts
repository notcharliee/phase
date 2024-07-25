import { readdirSync, statSync } from "node:fs"
import { basename, extname, join } from "node:path"

import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Collection,
  SlashCommandAssertions,
} from "discord.js"

import chalk from "chalk"
import cloneDeep from "lodash.clonedeep"

import { BotCommandBuilder, BotSubcommandBuilder } from "~/builders"
import { getMiddleware, loadingMessage } from "~/cli/utils"

import type { BotCommandExecute } from "~/builders"
import type {
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandGroupOption,
  Client,
} from "discord.js"

export type CommandsCollection = Collection<string, BotCommandBuilder>

interface CommandFile {
  name: string
  path: string
  parent?: string
  group?: string
  command: BotCommandBuilder
}

interface SubcommandFile extends Omit<CommandFile, "command"> {
  parent: string
  command: BotSubcommandBuilder
}

function isSubcommand(
  file: CommandFile | SubcommandFile,
): file is SubcommandFile {
  return typeof file.parent === "string"
}

export const getCommandFiles = async (dir: string = "src/commands") => {
  const commandFiles: (CommandFile | SubcommandFile)[] = []

  const processDir = async (currentDir: string, prefix: string = "") => {
    const entries = readdirSync(currentDir)

    for (const entry of entries) {
      if (entry.startsWith("_")) continue

      const path = join(currentDir, entry)
      const stats = statSync(path)

      if (stats.isDirectory()) {
        const group = !!(entry.startsWith("(") && entry.endsWith(")"))
        await processDir(path, prefix + (group ? "" : entry + "/"))
      } else if ([".ts", ".tsx", ".js", ".jsx"].includes(extname(entry))) {
        const file = await import(join(process.cwd(), path))
        const defaultExport = file.default as unknown

        if (!defaultExport) {
          throw new Error(`Command file '${path}' is missing a default export`)
        } else if (
          !(
            typeof defaultExport === "object" &&
            "metadata" in defaultExport &&
            defaultExport.metadata &&
            typeof defaultExport.metadata === "object" &&
            "type" in defaultExport.metadata &&
            (defaultExport.metadata.type === "command" ||
              defaultExport.metadata.type === "subcommand")
          )
        ) {
          throw new Error(
            `Command file '${path}' does not export a valid command builder`,
          )
        }

        const command = <(typeof commandFiles)[number]["command"]>defaultExport

        let relativePath = join(prefix, basename(entry, extname(entry)))
        relativePath = relativePath.replace(/\\/g, "/")
        relativePath = relativePath
          .replace(/\/\(/g, "/")
          .replace(/\)/g, "")
          .replace(/\//g, " ")

        const commandParts = relativePath.replace(/_/g, " ").split(" ")

        const parent = commandParts.length > 1 ? commandParts[0] : undefined
        const group = commandParts.length > 2 ? commandParts[1] : undefined
        const name = [parent, group, command.name].filter(Boolean).join(" ")

        commandFiles.push({
          name,
          parent,
          group,
          path,
          command,
        } as CommandFile | SubcommandFile)
      }
    }
  }

  await processDir(dir)

  return commandFiles
}

export const handleCommands = async (client: Client<false>) => {
  const commandFiles = await getCommandFiles()

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
      await loadingMessage(
        () => readyClient.application.commands.set(newCommands),
        {
          loading: "Setting up slash commands ...",
          success: "Slash commands set!",
          error: "An error occurred while setting up slash commands:\n",
        },
      )

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

  // get the middleware function
  const middleware = await getMiddleware()

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
      if (middleware) {
        await middleware(interaction, command.execute, command.metadata)
      } else {
        await command.execute(interaction)
      }
    } catch (error) {
      console.error(`Command '${command.name}' failed:`)
      console.error(error)
    }
  })
}
