import type { Client } from "discord.js"

export interface BotPlugin {
  name: string
  version: `${number}.${number}.${number}`
  onLoad: (client: Client<false>) => Client<false>
}

export type BotPluginResolvable = BotPlugin | { toJSON(): BotPlugin }
