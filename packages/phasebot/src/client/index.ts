import { existsSync } from "node:fs"
import { basename } from "node:path"

import { Client } from "discord.js"

import chalk from "chalk"
import dedent from "dedent"

import { loadConfigFile } from "~/client/config"
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
  getCronPaths,
  getEventPaths,
} from "~/client/handlers"
import type { BotMiddleware, loadMiddlewareFile } from "~/client/middleware"
import type { BotPrestart } from "~/client/prestart"

const globalForClient = globalThis as unknown as {
  djsClient: Client<true> | undefined
}

/**
 * Get the discord.js client instance.
 *
 * @throws If the client is not initialised.
 */
export function getClient(): Client<true> {
  if (!globalForClient.djsClient) {
    throw new Error("Client not initialised")
  }

  return globalForClient.djsClient
}

interface PhaseClientParams {
  /** Whether or not to run the bot in development mode. */
  dev?: boolean
  /** The config for the bot. */
  config?: BotConfig
  /**
   * The files to pass to the bot handlers.
   *
   * @remarks This is used for production builds to avoid loading the command files at runtime. Do not use this in development.
   */
  files?: {
    commands: Awaited<ReturnType<typeof getCommandFiles>>
    events: Awaited<ReturnType<typeof getEventPaths>>
    crons: Awaited<ReturnType<typeof getCronPaths>>
    middleware?: Awaited<ReturnType<typeof loadMiddlewareFile>>
    prestart?: Awaited<ReturnType<typeof loadPrestartFile>>
  }
  /** What exports to resolve for the bot. */
  exports?: {
    commands?: "default" | ((exports: any) => BotCommandBuilder)
    events?: "default" | ((exports: any) => BotEventBuilder)
    crons?: "default" | ((exports: any) => BotCronBuilder)
    middleware?: "default" | ((exports: any) => BotMiddleware)
    prestart?: "default" | ((exports: any) => BotPrestart)
  }
}

const defaultExports = {
  commands: "default",
  events: "default",
  crons: "default",
  middleware: "default",
  prestart: "default",
} as const

export class PhaseClient {
  public dev: PhaseClientParams["dev"]
  public config: PhaseClientParams["config"]
  public files: PhaseClientParams["files"]
  public exports: PhaseClientParams["exports"]

  private configPath: string | undefined
  private djsClient!: Client<false>

  constructor(params?: PhaseClientParams) {
    this.dev = params?.dev
    this.config = params?.config
    this.files = params?.files
    this.exports = { ...defaultExports, ...params?.exports }

    Bun.env.NODE_ENV = this.dev ? "development" : "production"
  }

  async init() {
    if (!this.config) {
      const configFile = await loadConfigFile()

      this.config = configFile.config
      this.configPath = configFile.path
    }

    this.djsClient = new Client(this.config) as Client<false>
    globalForClient.djsClient = this.djsClient as unknown as Client<true>

    console.log(dedent`
      ${phaseHeader}
        Config:       ${chalk.grey(basename(this.configPath ?? "N/A"))}
        Environment:  ${chalk.grey(Bun.env.NODE_ENV)}\n
    `)

    if (!existsSync("./src")) {
      throw new Error("No 'src' directory found.")
    }

    if (!Bun.env.DISCORD_TOKEN) {
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
