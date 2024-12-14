import Emittery from "emittery"

import { CommandManager } from "~/managers/CommandManager"
import { CronManager } from "~/managers/CronManager"
import { EventManager } from "~/managers/EventManager"
import { StoreManager } from "~/managers/StoreManager"

import type { BotCommand } from "~/structures/BotCommand"
import type { BotCron } from "~/structures/BotCron"
import type { BotEvent } from "~/structures/BotEvent"
import type { BotPlugin } from "~/structures/BotPlugin"
import type { BotClientEvents, DjsClient } from "~/types/client"
import type { BotMiddleware } from "~/types/middleware"
import type { BotPrestart } from "~/types/prestart"
import type { BotStores } from "~/types/stores"

export class BotClient<TReady extends boolean = boolean> {
  public readonly emitter: Emittery<BotClientEvents>

  public readonly client: DjsClient<TReady>
  public readonly plugins: BotPlugin[]

  public readonly stores: StoreManager
  public readonly commands: CommandManager
  public readonly crons: CronManager
  public readonly events: EventManager

  constructor(
    client: DjsClient<TReady>,
    options: {
      plugins?: BotPlugin[]
      stores?: BotStores
    } = {},
  ) {
    this.emitter = new Emittery()

    this.client = client
    this.plugins = options.plugins ?? []

    this.stores = new StoreManager(this, options.stores)
    this.commands = new CommandManager(this)
    this.crons = new CronManager(this)
    this.events = new EventManager(this)
  }

  public isReady(): this is BotClient<true> {
    return this.client.isReady()
  }

  public async init(bot: {
    prestart?: BotPrestart
    middlewares?: BotMiddleware
    commands: BotCommand[]
    crons: BotCron[]
    events: BotEvent[]
  }): Promise<BotClient<true>> {
    for (const plugin of this.plugins.filter((bp) => bp.trigger === "init")) {
      await plugin.onLoad(this)
      await this.emitter.emit("initPlugin", plugin)
    }

    void this.emitter.emit("init", this as BotClient<false>)

    if (bot.prestart) {
      await bot.prestart((this as BotClient<false>).client)
      void this.emitter.emit("prestartRun", bot.prestart)
    }

    if (bot.middlewares) {
      if (bot.middlewares.commands) this.commands.use(bot.middlewares.commands)
      void this.emitter.emit("initMiddleware", bot.middlewares)
    }

    await this.stores.init()

    await Promise.all([
      ...bot.commands.map((command) => this.commands.create(command)),
      ...bot.crons.map((cron) => this.crons.create(cron)),
      ...bot.events.map((event) => this.events.create(event)),
    ])

    await this.client.login()

    for (const plugin of this.plugins.filter((bp) => bp.trigger === "ready")) {
      await plugin.onLoad(this)
      void this.emitter.emit("initPlugin", plugin)
    }

    void this.emitter.emit("ready", this as BotClient<true>)

    return this as BotClient<true>
  }
}
