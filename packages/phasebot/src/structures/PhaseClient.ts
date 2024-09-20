import { existsSync, readdirSync, statSync } from "node:fs"
import { basename, extname, join } from "node:path"

import { Client } from "discord.js"

import chalk from "chalk"
import dedent from "dedent"

import { CommandManager } from "~/managers/CommandManager"
import { CronManager } from "~/managers/CronManager"
import { EventManager } from "~/managers/EventManager"
import { phaseHeader, spinner } from "~/utils"

import type { BotCronBuilder } from "~/structures/builders/BotCronBuilder"
import type { BotEventBuilder } from "~/structures/builders/BotEventBuilder"
import type { PhaseClientParams } from "~/types/client"
import type { CommandFile } from "~/types/commands"
import type { BotConfig } from "~/types/config"
import type { CronFile } from "~/types/crons"
import type { EventFile } from "~/types/events"
import type { BotMiddleware } from "~/types/middleware"
import type { BotPrestart } from "~/types/prestart"

const defaultConfig = {
  intents: [],
} satisfies PhaseClientParams["config"]

const defaultExports = {
  commands: "default",
  crons: "default",
  events: "default",
  middleware: "default",
  prestart: "default",
} satisfies PhaseClientParams["exports"]

export class PhaseClient {
  public dev: PhaseClientParams["dev"]
  public config: PhaseClientParams["config"]
  public exports: PhaseClientParams["exports"]
  public files: PhaseClientParams["files"]
  public plugins: PhaseClientParams["plugins"]

  public client!: Client<false>
  public commands!: CommandManager
  public crons!: CronManager
  public events!: EventManager

  constructor(params?: PhaseClientParams) {
    this.dev = params?.dev
    this.config = { ...defaultConfig, ...params?.config }
    this.exports = { ...defaultExports, ...params?.exports }
    this.files = params?.files
    this.plugins = params?.plugins
  }

  private get allowedFileExtensions() {
    const allowedFileExtensions = [".js", ".cjs", ".mjs"]

    if ("Bun" in globalThis || "Deno" in globalThis) {
      allowedFileExtensions.push(".ts", ".cts", ".mts")
    }

    return allowedFileExtensions
  }

  public async start() {
    process.env.NODE_ENV = this.dev ? "development" : "production"

    console.log(dedent`
      ${phaseHeader}
        Environment:  ${chalk.grey(process.env.NODE_ENV)}\n
    `)

    this.config = await this.loadConfig()
    this.client = new Client(this.config)

    if (this.plugins) {
      this.plugins.forEach((plugin) => {
        this.client = plugin(this.client)
      })
    }

    if (!existsSync("./src")) {
      throw new Error("No 'src' directory found.")
    }

    if (!process.env.DISCORD_TOKEN) {
      throw new Error("Missing 'DISCORD_TOKEN' environment variable.")
    }

    const cliSpinner = spinner()

    const prestartFunction = await this.loadPrestart()

    if (prestartFunction) {
      cliSpinner.start("Executing prestart ...")

      await new Promise<void>((resolve) => {
        setImmediate(async () => {
          await prestartFunction(this.client)
          resolve()
        })
      })

      cliSpinner.text = "Loading your code ..."
    } else {
      cliSpinner.start("Loading your code ...")
    }

    await new Promise<void>((resolve) => {
      setImmediate(async () => {
        const [commandFiles, cronFiles, eventFiles, middlewareFile] =
          await Promise.all([
            this.loadCommands(),
            this.loadCrons(),
            this.loadEvents(),
            this.loadMiddleware(),
          ])

        this.commands = new CommandManager(
          this.client,
          commandFiles,
          middlewareFile?.commands,
        )

        this.crons = new CronManager(this.client, cronFiles)

        this.events = new EventManager(this.client, eventFiles)

        resolve()
      })
    })

    cliSpinner.text = "Connecting to Discord ..."

    await new Promise<void>((resolve) => {
      setImmediate(async () => {
        await this.client.login()
        resolve()
      })
    })

    cliSpinner.succeed(
      `Bot is online! ${chalk.grey(`(${(Bun.nanoseconds() / 1e9).toFixed(2)}s)`)}\n`,
    )
  }

  async loadConfig(): Promise<BotConfig> {
    if (this.config) return this.config

    const configFiles = readdirSync("./").filter(
      (dirent) =>
        dirent.startsWith("phase.config") &&
        this.allowedFileExtensions.includes(extname(dirent)),
    )

    if (!configFiles.length) {
      throw new Error(
        `No config file found. Please make a 'phase.config.{${this.allowedFileExtensions.join()}}' file.`,
      )
    }

    if (configFiles.length > 1) {
      throw new Error(
        `You can only have one config file. Please delete or rename the other files.`,
      )
    }

    const filePath = join(process.cwd(), configFiles[0]!)

    const config = await import(filePath)
      .catch(() => null)
      .then((m) => m?.default as BotConfig | undefined)

    if (!config) {
      throw new Error("Config file is missing a default export.")
    }

    return config
  }

  async loadPrestart(): Promise<BotPrestart | undefined> {
    if (this.files?.prestart) return this.files.prestart

    const prestartFiles = readdirSync("./src").filter(
      (dirent) =>
        dirent.startsWith("prestart") &&
        this.allowedFileExtensions.includes(extname(dirent)),
    )

    if (!prestartFiles.length) {
      return undefined
    }

    if (prestartFiles.length > 1) {
      throw new Error(
        `You can only have one prestart file. Please delete or rename the other files.`,
      )
    }

    const filePath = join(process.cwd(), "src", prestartFiles[0]!)

    const prestart = await import(filePath)
      .catch(() => null)
      .then((m) => m?.default as BotPrestart | undefined)

    if (!prestart) {
      throw new Error("Prestart file is missing a default export.")
    }

    return prestart
  }

  async loadMiddleware(): Promise<BotMiddleware | undefined> {
    if (this.files?.middleware) return this.files.middleware

    const middlewareFiles = readdirSync("./src").filter(
      (dirent) =>
        dirent.startsWith("middleware") &&
        this.allowedFileExtensions.includes(extname(dirent)),
    )

    if (!middlewareFiles.length) {
      return undefined
    }

    if (middlewareFiles.length > 1) {
      throw new Error(
        `You can only have one middleware file. Please delete or rename the other files.`,
      )
    }

    const filePath = join(process.cwd(), "src", middlewareFiles[0]!)

    const middleware = await import(filePath)
      .catch(() => null)
      .then((m) => m as BotMiddleware)

    return middleware
  }

  async loadCommands(): Promise<CommandFile[]> {
    if (this.files?.commands) return this.files.commands

    const commandFiles: CommandFile[] = []

    const processDir = async (currentDir: string, prefix: string = "") => {
      const entries = readdirSync(currentDir)

      for (const entry of entries) {
        if (entry.startsWith("_")) continue

        const path = join(currentDir, entry)
        const stats = statSync(path)

        if (stats.isDirectory()) {
          const group = !!(entry.startsWith("(") && entry.endsWith(")"))
          await processDir(path, prefix + (group ? "" : entry + "/"))
        } else if (this.allowedFileExtensions.includes(extname(entry))) {
          const file = await import(join(process.cwd(), path))
          const defaultExport = file.default as unknown

          if (!defaultExport) {
            throw new Error(
              `Command file '${path}' is missing a default export`,
            )
          } else if (
            !(
              typeof defaultExport === "object" &&
              "metadata" in defaultExport &&
              defaultExport.metadata &&
              typeof defaultExport.metadata === "object" &&
              "type" in defaultExport.metadata &&
              (defaultExport.metadata.type === "command" ||
                defaultExport.metadata.type === "subcommand")
            )
          ) {
            throw new Error(
              `Command file '${path}' does not export a valid command builder`,
            )
          }

          const command = <(typeof commandFiles)[number]["command"]>(
            defaultExport
          )

          let relativePath = join(prefix, basename(entry, extname(entry)))
          relativePath = relativePath.replace(/\\/g, "/")
          relativePath = relativePath
            .replace(/\/\(/g, "/")
            .replace(/\)/g, "")
            .replace(/\//g, " ")

          const commandParts = relativePath.replace(/_/g, " ").split(" ")

          const parent = commandParts.length > 1 ? commandParts[0] : undefined
          const group = commandParts.length > 2 ? commandParts[1] : undefined
          const name = [parent, group, command.name].filter(Boolean).join(" ")

          if (parent) {
            commandFiles.push({
              name,
              parent,
              group,
              path,
              command,
            } as CommandFile)
          } else {
            commandFiles.push({
              name,
              path,
              command,
            } as CommandFile)
          }
        }
      }
    }

    await processDir("src/commands")

    return commandFiles
  }

  async loadCrons(): Promise<CronFile[]> {
    if (this.files?.crons) return this.files.crons

    const cronFiles: CronFile[] = []

    const processDir = async (currentDir: string) => {
      const entries = readdirSync(currentDir)

      for (const entry of entries) {
        if (entry.startsWith("_")) continue

        const path = join(currentDir, entry)
        const stats = statSync(path)

        if (stats.isDirectory()) {
          await processDir(path)
        } else if (this.allowedFileExtensions.includes(extname(entry))) {
          const file = await import(join(process.cwd(), path))
          const defaultExport = file.default as unknown

          if (!defaultExport) {
            throw new Error(`Cron file '${path}' is missing a default export`)
          } else if (
            !(
              typeof defaultExport === "object" &&
              "metadata" in defaultExport &&
              defaultExport.metadata &&
              typeof defaultExport.metadata === "object" &&
              "type" in defaultExport.metadata &&
              defaultExport.metadata.type === "cron"
            )
          ) {
            throw new Error(
              `Cron file '${path}' does not export a valid cron builder`,
            )
          }

          const cron = defaultExport as BotCronBuilder

          cronFiles.push({ path, cron })
        }
      }
    }

    await processDir("src/crons")

    return cronFiles
  }

  async loadEvents(): Promise<EventFile[]> {
    if (this.files?.events) return this.files.events

    const eventFiles: EventFile[] = []

    const processDir = async (currentDir: string) => {
      const entries = readdirSync(currentDir)

      for (const entry of entries) {
        if (entry.startsWith("_")) continue

        const path = join(currentDir, entry)
        const stats = statSync(path)

        if (stats.isDirectory()) {
          await processDir(path)
        } else if (this.allowedFileExtensions.includes(extname(entry))) {
          const file = await import(join(process.cwd(), path))
          const defaultExport = file.default as unknown

          if (!defaultExport) {
            throw new Error(`Event file '${path}' is missing a default export`)
          } else if (
            !(
              typeof defaultExport === "object" &&
              "metadata" in defaultExport &&
              defaultExport.metadata &&
              typeof defaultExport.metadata === "object" &&
              "type" in defaultExport.metadata &&
              defaultExport.metadata.type === "event"
            )
          ) {
            throw new Error(
              `Event file '${path}' does not export a valid event builder`,
            )
          }

          const event = defaultExport as BotEventBuilder

          eventFiles.push({ path, event })
        }
      }
    }

    await processDir("src/events")

    return eventFiles
  }
}
