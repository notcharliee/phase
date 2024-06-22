import type { Client, ClientEvents } from "discord.js"

export { setConfig, type Config } from "./config"

/**
 * @deprecated Use `BotEventBuilder` instead.
 * @since v0.4.0
 */
export const botEvent = <T extends keyof ClientEvents>(
  name: T,
  execute: (client: Client<true>, ...args: ClientEvents[T]) => any,
) => ({
  name,
  execute,
})
