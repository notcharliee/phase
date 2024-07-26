import { existsSync } from "node:fs"

import { Client } from "discord.js"

import chalk from "chalk"

import { handleCommands, handleCrons, handleEvents } from "~/cli/handlers"
import { cliHeader, getPrestart, loadingMessage } from "~/cli/utils"

import type { Config } from "~/config"

export class PhaseClient {
  private config!: Config & { configPath: string }
  private dev!: boolean
  private debug!: boolean

  constructor(params: {
    config: Config & { configPath: string }
    dev?: boolean
    debug?: boolean
  }) {
    this.config = params.config
    this.dev = params.dev ?? false
    this.debug = params.debug ?? false
  }

  async init() {
    process.env.NODE_ENV = this.dev ? "development" : "production"

    console.log(cliHeader(this.config))

    if (!existsSync("./src")) {
      throw new Error("No 'src' directory found.")
    }

    if (this.debug) console.log(1)

    if (!Bun.env.DISCORD_TOKEN) {
      throw new Error("Missing 'DISCORD_TOKEN' environment variable.")
    }

    if (this.debug) console.log(2)

    const client = new Client(this.config) as Client<false>

    if (this.debug) console.log(3)

    const prestart = await getPrestart()

    if (this.debug) console.log(4)

    if (prestart) {
      if (this.debug) console.log(5)

      await loadingMessage(async () => await prestart(client), {
        loading: "Executing prestart ...",
        success: "Prestart complete!",
        error: "An error occurred while executing prestart:\n",
      })
    }

    await loadingMessage(
      async () => {
        await Promise.all([
          handleCommands(client),
          handleCrons(client),
          handleEvents(client),
        ])
      },
      {
        loading: "Configuring the bot ...",
        success: "Bot configured!",
        error: "An error occurred while configuring the bot:\n",
      },
    )

    await loadingMessage(
      async () => {
        await client.login()
      },
      {
        loading: "Connecting to Discord...",
        success: "Connection established!",
        error: "An error occurred while connecting to Discord:\n",
      },
    )

    console.log(
      `${chalk.greenBright("✓")} Bot is online! ${chalk.grey(`(${(Bun.nanoseconds() / 1e9).toFixed(2)}s)`)}\n`,
    )
  }
}
