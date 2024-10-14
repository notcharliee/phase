import {
  ApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  BaseManager,
  Collection,
  PermissionsBitField,
  SlashCommandAssertions,
} from "discord.js"

import chalk from "chalk"

import { BotCommandBuilder } from "~/structures/builders/BotCommandBuilder"
import { spinner } from "~/utils"

import type { CommandFile } from "~/types/commands"
import type { BotCommandMiddleware } from "~/types/middleware"
import type {
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandGroupOption,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Client,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Snowflake,
} from "discord.js"

type PartialCommand = Pick<BotCommandBuilder, "name" | "metadata" | "execute">
type ApplicationCommandJSON = RESTPostAPIChatInputApplicationCommandsJSONBody

export class CommandManager extends BaseManager {
  protected _partialCommands = new Collection<string, PartialCommand>()
  protected _apiCommands = new Collection<string, ApplicationCommandJSON>()

  private commandsToCreate: ApplicationCommandJSON[] = []
  private commandsToDelete: [Snowflake, ApplicationCommandJSON][] = []
  private commandsToUpdate: [Snowflake, ApplicationCommandJSON][] = []

  /**
   * The middleware function to pass commands through.
   */
  readonly middleware?: BotCommandMiddleware

  constructor(
    client: Client,
    commandFiles: CommandFile[],
    middleware?: BotCommandMiddleware,
  ) {
    super(client)

    for (const file of commandFiles) {
      this._partialCommands.set(file.name, {
        name: file.name,
        metadata: file.command.metadata,
        execute: file.command.execute,
      })

      if (CommandManager.isSubcommand(file)) {
        let existingApiCommand = this._apiCommands.get(file.parent)

        if (!existingApiCommand) {
          this._apiCommands.set(
            file.parent,
            new BotCommandBuilder()
              .setName(file.parent)
              .setDescription(file.parent)
              .toJSON(),
          )

          existingApiCommand = this._apiCommands.get(file.parent)!
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
            SlashCommandAssertions.validateMaxOptionsLength(
              existingGroup.options,
            )

            existingGroup.options.push(file.command.toJSON())
          }
        } else {
          SlashCommandAssertions.validateMaxOptionsLength(
            existingApiCommand.options,
          )

          existingApiCommand.options.push(file.command.toJSON())
        }
      } else {
        this._apiCommands.set(file.command.name, file.command.toJSON())
      }
    }

    if (middleware) {
      this.middleware = middleware
    }

    this.client.once("ready", async (readyClient) => {
      const globalCommands = (
        await readyClient.application.commands.fetch()
      ).filter(({ type }) => type === ApplicationCommandType.ChatInput)

      const globalCommandNames: string[] = []

      for (const [snowflake, globalCommand] of globalCommands) {
        let globalCommandData = CommandManager.transformCommand(
          globalCommand.toJSON() as ChatInputApplicationCommandData,
        )

        let localCommandData = this._apiCommands.get(globalCommandData.name)

        globalCommandNames.push(globalCommandData.name)

        if (localCommandData) {
          globalCommandData = CommandManager.sortCommandKeys(globalCommandData)
          localCommandData = CommandManager.sortCommandKeys(localCommandData)

          const requiresUpdate =
            JSON.stringify(globalCommandData) !==
            JSON.stringify(localCommandData)

          if (requiresUpdate) {
            this.commandsToUpdate.push([snowflake, localCommandData])
          }
        } else {
          this.commandsToDelete.push([snowflake, globalCommandData])
        }
      }

      this.commandsToCreate = this._apiCommands
        .filter((apiCommand) => !globalCommandNames.includes(apiCommand.name))
        .toJSON()

      if (!globalCommands.size) {
        const cliSpinner = spinner("Setting up slash commands ...").start()

        await readyClient.application.commands.set(this.commandsToCreate)

        cliSpinner.succeed("Slash commands are live!")

        return
      }

      if (
        this.commandsToCreate.length ||
        this.commandsToDelete.length ||
        this.commandsToUpdate.length
      ) {
        const commandNames = new Array<string>().concat(
          this.commandsToCreate.map(({ name }) =>
            chalk.grey(`  ${chalk.bold.greenBright("+")} /${name}`),
          ),
          this.commandsToDelete.map(([_, { name }]) =>
            chalk.grey(`  ${chalk.bold.redBright("-")} /${name}`),
          ),
          this.commandsToUpdate.map(([_, { name }]) =>
            chalk.grey(`  ${chalk.bold.cyanBright("↑")} /${name}`),
          ),
        )

        const cliSpinner = spinner(
          `Updating ${commandNames.length} live slash commands ...`,
        ).start()

        await Promise.all([
          ...this.commandsToCreate.map((cmd) =>
            readyClient.application.commands.create(cmd),
          ),
          ...this.commandsToDelete.map(([snowflake]) =>
            readyClient.application.commands.delete(snowflake),
          ),
          ...this.commandsToUpdate.map(([snowflake, command]) =>
            readyClient.application.commands.edit(snowflake, command),
          ),
        ])

        cliSpinner.succeed("The following live slash commands were updated:")
        console.log(commandNames.join("\n") + "\n")
      }
    })

    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand() || !interaction.command) return

      const subcommandGroup = interaction.options.getSubcommandGroup(false)
      const subcommand = interaction.options.getSubcommand(false)

      const commandNameWithSubcommands = [
        interaction.commandName,
        subcommandGroup,
        subcommand,
      ]
        .filter(Boolean)
        .join(" ")

      const command = this._partialCommands.get(commandNameWithSubcommands)
      if (!command) return

      await this.execute(command, interaction)
    })
  }

  /**
   * Executes a command.
   *
   * @param command - The command to execute.
   * @param interaction - The interaction to execute the command with.
   */
  public async execute(
    command: PartialCommand,
    interaction: ChatInputCommandInteraction,
  ) {
    try {
      if (this.middleware) {
        return await this.middleware(
          interaction,
          command.execute,
          command.metadata,
        )
      } else {
        return await command.execute(interaction)
      }
    } catch (error) {
      console.error(`Command '${command.name}' failed:`)
      console.error(error)
    }
  }

  static isSubcommand(file: CommandFile) {
    return "parent" in file
  }

  static transformCommand(
    command: ChatInputApplicationCommandData,
  ): ApplicationCommandJSON {
    let default_member_permissions: string | null = null
    let options: APIApplicationCommandOption[] = []

    if (command.defaultMemberPermissions) {
      default_member_permissions =
        command.defaultMemberPermissions !== null
          ? new PermissionsBitField(
              command.defaultMemberPermissions,
            ).bitfield.toString()
          : command.defaultMemberPermissions
    }

    if (command.options) {
      options = command.options.map(
        (option) =>
          // @ts-expect-error it's a private method
          ApplicationCommand.transformOption(
            option,
          ) as APIApplicationCommandOption,
      )
    }

    return {
      name: command.name,
      name_localizations: command.nameLocalizations,
      description: command.description,
      nsfw: command.nsfw,
      description_localizations: command.descriptionLocalizations,
      type: command.type,
      options,
      default_member_permissions,
      dm_permission: command.dmPermission,
    }
  }

  static sortCommandKeys(data: ApplicationCommandJSON): ApplicationCommandJSON {
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

    return sortKeys({
      ...data,
      options: data.options?.length ? sortOptions(data.options) : [],
    })
  }
}
