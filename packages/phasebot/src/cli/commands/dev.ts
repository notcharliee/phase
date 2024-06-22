import { existsSync } from "node:fs"

import { Client } from "discord.js"

import chalk from "chalk"
import { Command } from "commander"

import { handleCommands, handleCrons, handleEvents } from "~/cli/handlers"
import { cliHeader, getConfig, getPrestart, loadingMessage } from "~/cli/utils"

export default new Command("dev")
  .description("run the bot in development mode")
  .action(async () => {
    process.env.NODE_ENV = "development"

    const config = await getConfig()
    console.log(cliHeader(config))

    if (!existsSync("./src")) {
      throw new Error("No 'src' directory found.")
    }

    if (!Bun.env.DISCORD_TOKEN) {
      throw new Error("Missing 'DISCORD_TOKEN' environment variable.")
    }

    const client = new Client(config) as Client<false>

    const prestart = await getPrestart()

    if (prestart) {
      await loadingMessage(
        async () => {
          await prestart(client)
        },
        {
          loading: "Executing prestart ...",
          success: "Prestart complete!",
          error: "An error occurred while executing prestart:\n",
        },
      )
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
  })
