import type { BotClient } from "~/client/BotClient"
import type { Awaitable } from "~/types/utils"

export type BotPluginVersion = `${number}.${number}.${number}`

export type BotPluginLoadTrigger = "init" | "ready"

export type BotPluginLoadFunction<TTrigger extends BotPluginLoadTrigger> = (
  client: BotClient<TTrigger extends "ready" ? true : false>,
) => Awaitable<void>
