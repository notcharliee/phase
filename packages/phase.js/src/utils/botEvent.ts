import type { Client, ClientEvents } from "discord.js"

export interface BotEvent {
  <BotEventName extends keyof ClientEvents>(
    name: BotEventName,
    execute: (
      client: Client<true>,
      ...data: ClientEvents[BotEventName]
    ) => Promise<any>,
  ): {
    name: keyof ClientEvents
    execute: (
      client: Client<true>,
      ...data: ClientEvents[BotEventName]
    ) => Promise<any>
  }
}

export const botEvent: BotEvent = (name, execute) => ({
  name,
  execute,
})
