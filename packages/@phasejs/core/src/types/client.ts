import type { BotClient } from "~/client/BotClient"
import type { BotCommand } from "~/client/BotCommand"
import type { BotCron } from "~/client/BotCron"
import type { BotEvent } from "~/client/BotEvent"
import type { BotPlugin } from "~/client/BotPlugin"
import type { StoreManager } from "~/managers/StoreManager"
import type { BotCommandBody } from "~/types/commands"
import type { BotMiddleware } from "~/types/middleware"
import type { BotPrestart } from "~/types/prestart"
import type { BotStore } from "~/types/stores"
import type { Client } from "discord.js"

import type {} from "discord.js"

declare module "discord.js" {
  interface Client {
    phase: BotClient
    stores: StoreManager
  }
}

export type DjsClient<T extends boolean = boolean> = Client<T>

export interface BotClientEvents {
  ready: BotClient<true>

  init: BotClient<false>
  initCommand: BotCommand
  initCron: BotCron
  initEvent: BotEvent
  initMiddleware: BotMiddleware
  initPlugin: BotPlugin
  initStore: BotStore

  liveCommandCreate: BotCommandBody
  liveCommandDelete: BotCommandBody
  liveCommandUpdate: BotCommandBody

  commandRun: BotCommand
  cronRun: BotCron
  eventRun: BotEvent
  prestartRun: BotPrestart
  middlewareRun: BotMiddleware
}
