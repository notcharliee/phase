import {
  APIApplicationCommandOption,
  SharedSlashCommandOptions,
  SlashCommandAssertions,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  ToAPIApplicationCommandOptions,
  type ChatInputCommandInteraction,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js"

import { Mixin } from "ts-mixer"

import { PhaseClient } from "~/cli/client"
import { PromiseUnion } from "~/types"

export type BotCommandExecute = (
  client: PhaseClient,
  interaction: ChatInputCommandInteraction,
) => PromiseUnion<unknown>

export type BotCommandMiddleware = (
  client: PhaseClient,
  interaction: ChatInputCommandInteraction,
  execute: BotCommandExecute,
) => PromiseUnion<unknown>

export type DeprecatedBotCommandFunction = {
  (
    command:
      | SlashCommandBuilder
      | Omit<BotCommandBuilder, "addSubcommandGroup" | "addSubcommand">
      | SlashCommandOptionsOnlyBuilder
      | SlashCommandSubcommandGroupBuilder
      | SlashCommandSubcommandsOnlyBuilder,
    execute: BotCommandExecute,
  ): RESTPostAPIChatInputApplicationCommandsJSONBody & {
    execute: BotCommandExecute
  }
}

class BotCommandBuilderBase {
  /**
   * The function to execute when the command is called.
   */
  public readonly execute!: BotCommandExecute

  /**
   * The metadata for the command.
   */
  public readonly metadata: object = {
    type: "command",
  }

  /**
   * Set the function to execute when the command is called.
   *
   * @param fn - The function to execute when the command is called.
   */
  setExecute(fn: BotCommandExecute) {
    Reflect.set(this, "execute", fn)
    return this
  }

  /**
   * Set the metadata for the command.
   *
   * @param metadata - The metadata for the command.
   */
  setMetadata(metadata: object) {
    Reflect.set(this, "metadata", {
      type: "command",
      ...metadata,
    })
    return this
  }
}

/**
 * An interface specifically for slash command subcommands.
 */
interface BotCommandSubcommandsOnlyBuilder
  extends Omit<
      SlashCommandBuilder,
      Exclude<keyof SharedSlashCommandOptions, "options">
    >,
    BotCommandBuilderBase {
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
  ): BotCommandSubcommandsOnlyBuilder

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
  ): BotCommandSubcommandsOnlyBuilder
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

    return this as unknown as BotCommandSubcommandsOnlyBuilder
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

    return this as unknown as BotCommandSubcommandsOnlyBuilder
  }
}
