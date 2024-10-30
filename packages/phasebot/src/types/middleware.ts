import type { BotCommandExecute } from "~/types/commands"
import type { ChatInputCommandInteraction } from "discord.js"

export type BotCommandMiddleware = (
  interaction: ChatInputCommandInteraction,
  execute: BotCommandExecute,
  metadata: object,
) => unknown

export interface BotMiddleware {
  commands?: BotCommandMiddleware
}
