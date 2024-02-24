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
      client: Client<true>,
      interaction: ChatInputCommandInteraction,
    ) => Promise<any>,
  ): RESTPostAPIChatInputApplicationCommandsJSONBody & {
    execute: (
      client: Client<true>,
      interaction: ChatInputCommandInteraction,
    ) => Promise<any>
  }
}

export const botCommand: BotCommand = (command, execute) => ({
  ...command.toJSON(),
  execute,
})
