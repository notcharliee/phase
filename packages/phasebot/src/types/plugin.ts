import type { BotPluginBuilder } from "~/structures/builders"
import type { Awaitable } from "~/types/utils"
import type { Client } from "discord.js"

export interface BotPlugin {
  name: string
  version: `${number}.${number}.${number}`
  onLoad: (client: Client<false>) => Awaitable<void>
}

export type BotPluginResolvable = BotPlugin | BotPluginBuilder
