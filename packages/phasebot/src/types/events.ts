import type { BotEventBuilder } from "~/structures/builders/BotEventBuilder"
import type { Client, ClientEvents } from "discord.js"

export type BotEventExecute<T extends keyof ClientEvents = keyof ClientEvents> =
  (client: Client, ...args: ClientEvents[T]) => unknown | Promise<unknown>

export interface EventFile {
  path: string
  event: BotEventBuilder
}
