import { Client as DiscordClient } from "discord.js"

import chalk from "chalk"

import { spinner } from "~/lib/spinner"
import { version } from "~/lib/utils"

import { analyseApp } from "~/loaders/app"
import { loadCommandFiles } from "~/loaders/commands"
import { loadCronFiles } from "~/loaders/crons"
import { loadEventFiles } from "~/loaders/events"
import { loadMiddlewareFile } from "~/loaders/middleware"
import { loadPrestartFile } from "~/loaders/prestart"
import { CommandManager } from "~/managers/CommandManager"
import { CronManager } from "~/managers/CronManager"
import { EventManager } from "~/managers/EventManager"
import { StoreManager } from "~/managers/StoreManager"

import type { BotPlugin } from "~/client/BotPlugin"
import type { PhaseClientParams } from "~/types/client"

export class BotClient<TReady extends boolean = boolean> {
  public readonly client: DiscordClient<TReady>
  public readonly stores: StoreManager
  public readonly commands: CommandManager
  public readonly crons: CronManager
  public readonly events: EventManager

  private readonly plugins: {
    init: BotPlugin<"init">[]
    ready: BotPlugin<"ready">[]
  }

  constructor(params: PhaseClientParams) {
    this.client = new DiscordClient(params.config)
    this.stores = new StoreManager(this.client, params.stores)
    this.commands = new CommandManager(this.client)
    this.crons = new CronManager(this.client)
    this.events = new EventManager(this.client)

    this.plugins = {
      init:
        params.plugins?.filter(
          (p): p is BotPlugin<"init"> => p.trigger === "init",
        ) ?? [],
      ready:
        params.plugins?.filter(
          (p): p is BotPlugin<"ready"> => p.trigger === "ready",
        ) ?? [],
    }
  }

  public isReady(): this is BotClient<true> {
    return this.client.isReady()
  }

  public async init(): Promise<BotClient<true>> {
    // scan the app directory for files
    const paths = analyseApp()

    console.log(`${chalk.bold.white(`☽ PhaseBot v${version}`)}`)
    console.log(`  Environment:  ${chalk.grey(process.env.NODE_ENV)}`)
    console.log(`  `)

    const cliSpinner = spinner("Executing prestart ...").start()

    // load & execute prestart
    if (paths.prestart) {
      const prestartFunction = await loadPrestartFile(paths.prestart)
      await prestartFunction((this as BotClient<false>).client)
    }

    // initialise plugins with "init" trigger
    for (const plugin of this.plugins.init) {
      await plugin.onLoad(this as BotClient<false>)
    }

    // initialise stores
    await this.stores.init()

    cliSpinner.text = "Loading your code ..."

    // load middleware
    const middlewareFile = paths.middleware
      ? await loadMiddlewareFile(paths.middleware)
      : undefined

    if (middlewareFile) {
      if (middlewareFile.commands) {
        this.commands.use(middlewareFile.commands)
      }
    }

    // load commands, crons, and events
    const [commandFiles, cronFiles, eventFiles] = await Promise.all([
      loadCommandFiles(this.client, paths.commands),
      loadCronFiles(this.client, paths.crons),
      loadEventFiles(this.client, paths.events),
    ])

    // create commands
    for (const commandFile of commandFiles) {
      this.commands.create(commandFile.command)
    }

    // create crons
    for (const cronFile of cronFiles) {
      this.crons.create(cronFile.cron)
    }

    // create events
    for (const eventFile of eventFiles) {
      this.events.create(eventFile.event)
    }

    cliSpinner.text = "Connecting to Discord ..."

    // initialise the client connection
    await this.client.login()

    // initialise plugins with "ready" trigger
    for (const plugin of this.plugins.ready) {
      await plugin.onLoad(this as BotClient<true>)
    }

    cliSpinner.succeed(
      `Bot is online! ${chalk.grey(`(${(Bun.nanoseconds() / 1e9).toFixed(2)}s)`)}\n`,
    )

    return this as BotClient<true>
  }
}

/** @deprecated Use `BotClient` instead. */
export const PhaseClient = BotClient
