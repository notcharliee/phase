import type {
  BotCommandBuilder,
  BotSubcommandBuilder,
} from "~/structures/builders/BotCommandBuilder"
import type { ChatInputCommandInteraction } from "discord.js"

export type BotCommandExecute = (
  interaction: ChatInputCommandInteraction,
) => unknown | Promise<unknown>

export interface BaseCommandFile {
  name: string
  path: string
  command: BotCommandBuilder
}

export interface SubCommandFile {
  name: string
  path: string
  parent: string
  group?: string
  command: BotSubcommandBuilder
}

export type CommandFile = BaseCommandFile | SubCommandFile
