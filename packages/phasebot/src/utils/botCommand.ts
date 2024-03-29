import type {
  ChatInputCommandInteraction,
  Client,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  APIApplicationCommandSubcommandGroupOption,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js"

import {
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js"

/**
 * @deprecated Use `BotCommandBuilder` instead.
 */
export interface BotCommand {
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
  ): (
    | RESTPostAPIChatInputApplicationCommandsJSONBody
    | APIApplicationCommandSubcommandGroupOption
  ) & {
    execute: (
      client: Client<true>,
      interaction: ChatInputCommandInteraction,
    ) => unknown
  }
}

/**
 * @deprecated Use `BotCommandExecuteFunction` instead.
 */
export interface BotCommandMiddleware {
  (client: Client<true>, interaction: ChatInputCommandInteraction): unknown
}

/**
 * @deprecated Use `BotCommandBuilder` instead.
 */
export const botCommand: BotCommand = (command, execute) => ({
  ...command.toJSON(),
  execute,
})


export class BotCommandBuilder extends SlashCommandBuilder {}
