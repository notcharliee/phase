import { existsSync, readdirSync, statSync } from "node:fs"
import { basename, extname, join } from "node:path"

import Emittery from "emittery"

import { loadCommandFiles } from "~/loaders/commands"
import { loadCronFiles } from "~/loaders/crons"
import { loadEventFiles } from "~/loaders/events"
import { loadMiddlewareFile } from "~/loaders/middleware"
import { loadPrestartFile } from "~/loaders/prestart"
import { CommandManager } from "~/managers/CommandManager"
import { CronManager } from "~/managers/CronManager"
import { EventManager } from "~/managers/EventManager"
import { StoreManager } from "~/managers/StoreManager"
import { validExtnames } from "~/utils/constants"

import type { BotPlugin } from "~/structures/BotPlugin"
import type { BotClientEvents } from "~/types/client"
import type { BotStores } from "~/types/stores"
import type { Client as DjsClient } from "discord.js"

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

  public async init(): Promise<BotClient<true>> {
    for (const plugin of this.plugins.filter((bp) => bp.trigger === "init")) {
      await plugin.onLoad(this)
      await this.emitter.emit("initPlugin", plugin)
    }

    void this.emitter.emit("init", this as BotClient<false>)

    const paths = BotClient.analyseApp()

    if (paths.prestart) {
      const prestartFunction = await loadPrestartFile(paths.prestart)
      await prestartFunction((this as BotClient<false>).client)
      void this.emitter.emit("prestartRun", prestartFunction)
    }

    if (paths.middleware) {
      const middlewares = await loadMiddlewareFile(paths.middleware)
      if (middlewares.commands) this.commands.use(middlewares.commands)
      void this.emitter.emit("initMiddleware", middlewares)
    }

    await this.stores.init()

    const [commandFiles, cronFiles, eventFiles] = await Promise.all([
      loadCommandFiles(this.client, paths.commands),
      loadCronFiles(this.client, paths.crons),
      loadEventFiles(this.client, paths.events),
    ])

    await Promise.all([
      ...commandFiles.map(({ command }) => this.commands.create(command)),
      ...cronFiles.map(({ cron }) => this.crons.create(cron)),
      ...eventFiles.map(({ event }) => this.events.create(event)),
    ])

    await this.client.login()

    for (const plugin of this.plugins.filter((bp) => bp.trigger === "ready")) {
      await plugin.onLoad(this)
      void this.emitter.emit("initPlugin", plugin)
    }

    void this.emitter.emit("ready", this as BotClient<true>)

    return this as BotClient<true>
  }

  static analyseApp() {
    const srcDirPath = join(process.cwd(), "src")
    const appDirPath = join(srcDirPath, "app")

    if (!existsSync(srcDirPath)) {
      throw new Error("No source directory found.")
    }

    if (!existsSync(appDirPath)) {
      throw new Error("No app directory found.")
    }

    const srcDirContentPaths: {
      middleware: string | undefined
      prestart: string | undefined
    } = {
      middleware: undefined,
      prestart: undefined,
    }

    const appDirContentPaths: {
      commands: string[]
      crons: string[]
      events: string[]
    } = {
      commands: [],
      crons: [],
      events: [],
    }

    const analyseSrcDirectory = (dirPath: string) => {
      const dirEntries = readdirSync(dirPath)
      const validBasenames = Object.keys(srcDirContentPaths)

      for (const entry of dirEntries) {
        const entryExtname = extname(entry)
        const entryBasename = basename(entry, entryExtname)

        if (!validExtnames.includes(entryExtname)) continue
        if (!validBasenames.includes(entryBasename)) continue

        srcDirContentPaths[entryBasename as keyof typeof srcDirContentPaths] =
          join(dirPath, entry)
      }
    }

    const analyseAppDirectory = (dirPath: string) => {
      const dirEntries = readdirSync(dirPath)
      const validBasenames = Object.keys(appDirContentPaths)

      for (const entry of dirEntries) {
        if (entry.startsWith("_")) continue

        const entryPath = join(dirPath, entry)
        const entryStats = statSync(entryPath)

        if (!entryStats.isDirectory()) {
          console.warn(`Invalid file found in app directory: ${entry}`)
          continue
        }

        if (entry.startsWith("(") && entry.endsWith(")")) {
          analyseAppDirectory(entryPath)
        }

        if (!validBasenames.includes(entry)) {
          console.warn(`Invalid subdirectory found in app directory: ${entry}`)
          continue
        }

        appDirContentPaths[entry as keyof typeof appDirContentPaths].push(
          entryPath,
        )
      }
    }

    analyseSrcDirectory(srcDirPath)
    analyseAppDirectory(appDirPath)

    return {
      ...srcDirContentPaths,
      ...appDirContentPaths,
    }
  }
}
