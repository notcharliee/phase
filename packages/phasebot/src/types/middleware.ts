import type { BotCommandExecute } from "~/builders"
import type { ChatInputCommandInteraction } from "discord.js"

export type BotCommandMiddleware = (
  interaction: ChatInputCommandInteraction,
  execute: BotCommandExecute,
  metadata: object,
) => unknown | Promise<unknown>

export interface BotMiddleware {
  commands?: BotCommandMiddleware
}
