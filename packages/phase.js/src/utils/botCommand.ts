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
    ) => any,
  ): (
    | RESTPostAPIChatInputApplicationCommandsJSONBody
    | APIApplicationCommandSubcommandGroupOption
  ) & {
    execute: (
      client: Client<true>,
      interaction: ChatInputCommandInteraction,
    ) => any
  }
}

export const botCommand: BotCommand = (command, execute) => ({
  ...command.toJSON(),
  execute,
})

export class BotCommandBuilder extends SlashCommandBuilder {}
