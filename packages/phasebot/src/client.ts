import { existsSync } from "node:fs"

import { Client } from "discord.js"

import chalk from "chalk"

import { handleCommands, handleCrons, handleEvents } from "~/cli/handlers"
import { cliHeader, getPrestart, loadingMessage } from "~/cli/utils"

import type { Config } from "~/config"

export class PhaseClient {
  private config!: Config & { configPath: string }
  private dev!: boolean

  constructor(params: {
    config: Config & { configPath: string }
    dev?: boolean
  }) {
    this.config = params.config
    this.dev = params.dev ?? false
  }

  async init() {
    process.env.NODE_ENV = this.dev ? "development" : "production"

    console.log(cliHeader(this.config))

    if (!existsSync("./src")) {
      throw new Error("No 'src' directory found.")
    }

    if (!Bun.env.DISCORD_TOKEN) {
      throw new Error("Missing 'DISCORD_TOKEN' environment variable.")
    }

    const client = new Client(this.config) as Client<false>

    console.log("test")

    const prestart = await getPrestart()

    console.log("test")

    if (prestart) {
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
