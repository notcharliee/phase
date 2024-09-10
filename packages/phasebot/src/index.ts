import type { Client, ClientEvents } from "discord.js"

export * from "~/client"

/**
 * @deprecated Use `BotEventBuilder` instead.
 * @since v0.4.0
 */
export const botEvent = <T extends keyof ClientEvents>(
  name: T,
  execute: (client: Client<true>, ...args: ClientEvents[T]) => unknown,
) => ({ name, execute })
