import { Mixin } from "ts-mixer"

import {
  APIApplicationCommandOption,
  SlashCommandAssertions,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  ToAPIApplicationCommandOptions,
  type ChatInputCommandInteraction,
  type Client,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  type SlashCommandOptionsOnlyBuilder,
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

class BotCommandBuilderBase {
  /**
   * The function to execute when the command is called.
   */
  public readonly execute: BotCommandExecuteFunction | undefined = undefined

  /**
   * Set the function to execute when the command is called.
   *
   * @param fn - The function to execute when the command is called.
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
   *
   * @param metadata - The metadata for the command.
   */
  setMetadata(metadata: object) {
    Reflect.set(this, "metadata", metadata)
    return this
  }
}

/**
 * A builder that creates API-compatible JSON data for phasebot slash commands.
 * @extends SlashCommandBuilder
 */
export class BotCommandBuilder extends Mixin(
  BotCommandBuilderBase,
  SlashCommandBuilder,
) {
  /**
   * The options for the command.
   *
   * @param options - The options for the command.
   */
  setOptions(options: APIApplicationCommandOption[]) {
    const toAPIApplicationCommandOptions: ToAPIApplicationCommandOptions[] =
      options.map((option) => ({
        toJSON: () => option,
      }))

    Reflect.set(this, "options", toAPIApplicationCommandOptions)
    return this
  }

  /**
   * Adds a new subcommand group to this command.
   *
   * @param input - A function that returns a subcommand group builder or an already built builder
   */
  addSubcommandGroup(
    input:
      | SlashCommandSubcommandGroupBuilder
      | ((
          subcommandGroup: SlashCommandSubcommandGroupBuilder,
        ) => SlashCommandSubcommandGroupBuilder),
  ) {
    const { options } = this

    // First, assert options conditions - we cannot have more than 25 options
    SlashCommandAssertions.validateMaxOptionsLength(options)

    // Get the final result
    const result =
      typeof input === "function"
        ? input(new SlashCommandSubcommandGroupBuilder())
        : input

    SlashCommandAssertions.assertReturnOfBuilder(
      result,
      SlashCommandSubcommandGroupBuilder,
    )

    // Push it
    options.push(result)

    return this as unknown as SlashCommandSubcommandsOnlyBuilder &
      BotCommandBuilderBase
  }

  /**
   * Adds a new subcommand to this command.
   *
   * @param input - A function that returns a subcommand builder or an already built builder
   */
  addSubcommand(
    input:
      | SlashCommandSubcommandBuilder
      | ((
          subcommandGroup: SlashCommandSubcommandBuilder,
        ) => SlashCommandSubcommandBuilder),
  ) {
    const { options } = this

    // First, assert options conditions - we cannot have more than 25 options
    SlashCommandAssertions.validateMaxOptionsLength(options)

    // Get the final result
    const result =
      typeof input === "function"
        ? input(new SlashCommandSubcommandBuilder())
        : input

    SlashCommandAssertions.assertReturnOfBuilder(
      result,
      SlashCommandSubcommandBuilder,
    )

    // Push it
    options.push(result)

    return this as unknown as SlashCommandSubcommandsOnlyBuilder &
      BotCommandBuilderBase
  }
}
