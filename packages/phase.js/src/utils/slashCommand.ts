import type {
  ChatInputCommandInteraction,
  Client,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from "discord.js"

// Define the structure of a slash command
interface SlashCommand {
  (data: SlashCommandData, execute: SlashCommandExecute): SlashCommandReturn
}

// Define the structure of slash command data
interface SlashCommandData extends SlashCommandBuilder {}

// Define the structure of slash command execution
type SlashCommandExecute = (
  client: Client<true>,
  interaction: ChatInputCommandInteraction,
) => Promise<any>

// Define the structure of the returned object from the slash command
interface SlashCommandReturn
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
