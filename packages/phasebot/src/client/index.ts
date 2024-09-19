import { existsSync } from "node:fs"
import { basename } from "node:path"

import { Client } from "discord.js"

import chalk from "chalk"
import dedent from "dedent"

import { loadConfigFile, setConfig } from "~/client/config"
import { handleCommands, handleCrons, handleEvents } from "~/client/handlers"
import { getPrestartPath, loadPrestartFile } from "~/client/prestart"
import { phaseHeader, spinner } from "~/utils"

import type {
  BotCommandBuilder,
  BotCronBuilder,
  BotEventBuilder,
} from "~/builders"
import type { BotConfig } from "~/client/config"
import type {
  getCommandFiles,
  getCronFiles,
  getEventFiles,
} from "~/client/handlers"
import type { BotMiddleware, loadMiddlewareFile } from "~/client/middleware"
import type { BotPrestart } from "~/client/prestart"

export { setConfig }
export type { BotConfig }

export interface PhaseClientParams {
  /**
   * Whether or not to run the bot in development mode.
   * 
   * @remarks This will override the `NODE_ENV` environment variable.
   */
  dev?: boolean

  /**
   * The discord.js client options.
   */
  config?: BotConfig

  /**
   * The files to pass to the bot handlers.
   *
   * @remarks This is used for production builds to avoid loading the command files at runtime.
   */
  files?: {
    commands: Awaited<ReturnType<typeof getCommandFiles>>
    crons: Awaited<ReturnType<typeof getCronFiles>>
    events: Awaited<ReturnType<typeof getEventFiles>>
    middleware?: Awaited<ReturnType<typeof loadMiddlewareFile>>
    prestart?: Awaited<ReturnType<typeof loadPrestartFile>>
  }

  /**
   * What exports to use in bot files.
   */
  exports?: {
    commands?: "default" | ((exports: unknown) => BotCommandBuilder)
    crons?: "default" | ((exports: unknown) => BotCronBuilder)
    events?: "default" | ((exports: unknown) => BotEventBuilder)
    middleware?: "default" | ((exports: unknown) => BotMiddleware)
    prestart?: "default" | ((exports: unknown) => BotPrestart)
  }

  /**
   * The plugins to load.
   *
   * @remarks Plugins are loaded in the order they are specified.
   */
  plugins?: ((client: Client<false>) => Client<false>)[]
}

const defaultExports = {
  commands: "default",
  crons: "default",
  events: "default",
  middleware: "default",
  prestart: "default",
} as const

export class PhaseClient {
  public dev: PhaseClientParams["dev"]
  public config: PhaseClientParams["config"]
  public files: PhaseClientParams["files"]
  public exports: PhaseClientParams["exports"]
  public plugins: PhaseClientParams["plugins"]

  private configPath: string | undefined
  private djsClient!: Client<false>

  constructor(params?: PhaseClientParams) {
    this.dev = params?.dev
    this.config = params?.config
    this.files = params?.files
    this.exports = { ...defaultExports, ...params?.exports }
    this.plugins = params?.plugins

    process.env.NODE_ENV = this.dev ? "development" : "production"
  }

  async start() {
    if (!this.config) {
      const configFile = await loadConfigFile()

      this.config = configFile.config
      this.configPath = configFile.path
    }

    this.djsClient = new Client(this.config) as Client<false>

    if (this.plugins) {
      this.plugins.forEach((plugin) => {
        this.djsClient = plugin(this.djsClient)
      })
    }

    console.log(dedent`
      ${phaseHeader}
        Config:       ${chalk.grey(basename(this.configPath ?? "N/A"))}
        Environment:  ${chalk.grey(process.env.NODE_ENV)}\n
    `)

    if (!existsSync("./src")) {
      throw new Error("No 'src' directory found.")
    }

    if (!process.env.DISCORD_TOKEN) {
      throw new Error("Missing 'DISCORD_TOKEN' environment variable.")
    }

    const cliSpinner = spinner()

    if (this.files) {
      throw new Error("Not implemented yet. Please use the CLI.")
    } else {
      const prestartPath = await getPrestartPath()

      if (prestartPath) {
        cliSpinner.start("Executing prestart ...")

        const prestartFunction = await loadPrestartFile(prestartPath)
        await prestartFunction(this.djsClient)

        cliSpinner.text = "Loading your code ..."
      } else {
        cliSpinner.start("Loading your code ...")
      }

      await Promise.all([
        handleCommands(this.djsClient),
        handleCrons(this.djsClient),
        handleEvents(this.djsClient),
      ])

      cliSpinner.text = "Connecting to Discord ..."

      await this.djsClient.login()

      cliSpinner.succeed(
        `Bot is online! ${chalk.grey(`(${(Bun.nanoseconds() / 1e9).toFixed(2)}s)`)}\n`,
      )
    }
  }
}
