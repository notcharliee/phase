import { existsSync, readdirSync, statSync } from "node:fs"
import { basename, extname, join } from "node:path"

import Emittery from "emittery"

import { loadCommands } from "~/loaders/commands"
import { loadCrons } from "~/loaders/crons"
import { loadEvents } from "~/loaders/events"
import { loadMiddleware } from "~/loaders/middleware"
import { loadPrestart } from "~/loaders/prestart"
import { CommandManager } from "~/managers/CommandManager"
import { CronManager } from "~/managers/CronManager"
import { EventManager } from "~/managers/EventManager"
import { StoreManager } from "~/managers/StoreManager"
import { validExtnames } from "~/utils/constants"

import type { BotPlugin } from "~/structures/BotPlugin"
import type { BotClientEvents } from "~/types/client"
import type { BotStores } from "~/types/stores"
import type { Client as DjsClient } from "discord.js"

interface AppManifest {
  middleware: string | undefined
  prestart: string | undefined
  commands: string[]
  crons: string[]
  events: string[]
}

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

    const paths = await BotClient.analyseApp()

    if (paths.prestart) {
      const prestartFunction = await loadPrestart(paths.prestart)
      await prestartFunction((this as BotClient<false>).client)
      void this.emitter.emit("prestartRun", prestartFunction)
    }

    if (paths.middleware) {
      const middlewares = await loadMiddleware(paths.middleware)
      if (middlewares.commands) this.commands.use(middlewares.commands)
      void this.emitter.emit("initMiddleware", middlewares)
    }

    await this.stores.init()

    const [commands, crons, events] = await Promise.all([
      loadCommands(this.client, paths.commands),
      loadCrons(this.client, paths.crons),
      loadEvents(this.client, paths.events),
    ])

    await Promise.all([
      ...commands.map((command) => this.commands.create(command)),
      ...crons.map((cron) => this.crons.create(cron)),
      ...events.map((event) => this.events.create(event)),
    ])

    await this.client.login()

    for (const plugin of this.plugins.filter((bp) => bp.trigger === "ready")) {
      await plugin.onLoad(this)
      void this.emitter.emit("initPlugin", plugin)
    }

    void this.emitter.emit("ready", this as BotClient<true>)

    return this as BotClient<true>
  }

  static async analyseApp(srcDir?: string): Promise<AppManifest> {
    const manifestFile = Bun.file("./app-build-manifest.json")

    if (await manifestFile.exists()) {
      const manifest = (await manifestFile.json()) as AppManifest
      return manifest
    }

    const srcDirPath = srcDir ?? join(process.cwd(), "src")
    const appDirPath = join(srcDirPath, "app")

    if (!existsSync(srcDirPath)) {
      throw new Error("No source directory found.")
    }

    if (!existsSync(appDirPath)) {
      throw new Error("No app directory found.")
    }

    const srcDirContentPaths: Pick<AppManifest, "middleware" | "prestart"> = {
      middleware: undefined,
      prestart: undefined,
    }

    const appDirContentPaths: Omit<AppManifest, "middleware" | "prestart"> = {
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
          ...BotClient.analyseDirectory([], entryPath),
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

  static analyseDirectory(accPaths: string[], currentDirPath: string) {
    const entries = readdirSync(currentDirPath)

    for (const entry of entries) {
      if (entry.startsWith("_")) continue

      const entryPath = join(currentDirPath, entry)
      const entryStats = statSync(entryPath)

      if (entryStats.isDirectory()) {
        BotClient.analyseDirectory(accPaths, entryPath)
      } else if (validExtnames.includes(extname(entry))) {
        accPaths.push(entryPath)
      }
    }

    return accPaths
  }
}
