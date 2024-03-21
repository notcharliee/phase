import {
  APIApplicationCommandOption,
  SlashCommandBuilder,
  ToAPIApplicationCommandOptions,
  type ChatInputCommandInteraction,
  type Client,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandGroupBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js"

export type BotCommandExecuteFunction = (
  client: Client<true>,
  interaction: ChatInputCommandInteraction,
) => unknown

export type DeprecatedBotCommandFunction = {
  (
    command:
      | SlashCommandBuilder
      | Omit<BotCommandBuilder, "addSubcommandGroup" | "addSubcommand">
      | SlashCommandOptionsOnlyBuilder
      | SlashCommandSubcommandGroupBuilder
      | SlashCommandSubcommandsOnlyBuilder,
    execute: (
      client: Client<true>,
      interaction: ChatInputCommandInteraction,
    ) => unknown,
  ): RESTPostAPIChatInputApplicationCommandsJSONBody & {
    execute: (
      client: Client<true>,
      interaction: ChatInputCommandInteraction,
    ) => unknown
  }
}

/**
 * A builder that creates API-compatible JSON data for slash commands.
 */
export class BotCommandBuilder extends SlashCommandBuilder {
  /**
   * The function to execute when the command is called.
   */
  public readonly execute: BotCommandExecuteFunction | undefined = undefined

  /**
   * Set the function to execute when the command is called.
   */
  setExecute(fn: BotCommandExecuteFunction) {
    Reflect.set(this, "execute", fn)
    return this
  }

  /**
   * The metadata for the command.
   */
  public readonly metadata: object | undefined = undefined

  /**
   * Set the metadata for the command.
   */
  setMetadata(metadata: object) {
    Reflect.set(this, "metadata", metadata)
    return this
  }

  /**
   * The options for the command.
   */
  setOptions(options: APIApplicationCommandOption[]) {
    const toAPIApplicationCommandOptions: ToAPIApplicationCommandOptions[] =
      options.map((option) => ({
        toJSON: () => option,
      }))

    Reflect.set(this, "options", toAPIApplicationCommandOptions)
    return this
  }
}
