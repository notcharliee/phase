import type { BotCommand } from "~/client/structures/BotCommand"
import type {
  APIApplicationCommandSubcommandOption,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js"

export type BotCommandBody = Omit<
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  "default_member_permissions" | "default_permission" | "nsfw" | "handler"
>
export type BotSubcommandBody = Omit<
  APIApplicationCommandSubcommandOption,
  "required"
>

export type BotCommandOrSubcommandBody = BotCommandBody | BotSubcommandBody
export type BotCommandMetadata = { type: "command"; [key: string]: unknown }
export type BotCommandExecute = (
  interaction: ChatInputCommandInteraction,
) => unknown | Promise<unknown>

export type BotCommandNameResolvable =
  | string
  | BotCommand
  | ChatInputCommandInteraction

export interface BotCommandFile {
  path: string
  command: BotCommand
}
