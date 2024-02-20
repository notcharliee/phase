import type {
  ChatInputCommandInteraction,
  Client,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from "discord.js"

export interface BotCommand {
  (
    command: SlashCommandBuilder,
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
