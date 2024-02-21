import type {
  ChatInputCommandInteraction,
  Client,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js"

import { SlashCommandBuilder } from "discord.js"


export class BotCommandBuilder extends SlashCommandBuilder {}

export interface BotCommand {
  (
    command: BotCommandBuilder,
    execute: (
      interaction: ChatInputCommandInteraction,
      client: Client<true>,
    ) => Promise<any>,
  ): RESTPostAPIChatInputApplicationCommandsJSONBody & {
    execute: (
      interaction: ChatInputCommandInteraction,
      client: Client<true>,
    ) => Promise<any>
  }
}

export const botCommand: BotCommand = (command, execute) => ({
  ...command.toJSON(),
  execute,
})
