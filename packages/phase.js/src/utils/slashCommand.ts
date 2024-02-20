import type {
  ChatInputCommandInteraction,
  Client,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from "discord.js"

// Define the structure of a slash command
export interface SlashCommand {
  (data: SlashCommandData, execute: SlashCommandExecute): SlashCommandReturn
}

// Define the structure of slash command data
export interface SlashCommandData extends SlashCommandBuilder {}

// Define the structure of slash command execution
export type SlashCommandExecute = (
  interaction: ChatInputCommandInteraction,
  client: Client<true>,
) => Promise<any>

// Define the structure of the returned object from the slash command
export interface SlashCommandReturn
  extends RESTPostAPIChatInputApplicationCommandsJSONBody {
  execute: SlashCommandExecute
}

// Implement the slash command
export const slashCommand: SlashCommand = (data, execute) => {
  return {
    ...data.toJSON(),
    execute,
  }
}
