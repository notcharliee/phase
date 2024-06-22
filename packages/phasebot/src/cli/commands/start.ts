import { existsSync } from "node:fs"

import { Client } from "discord.js"

import chalk from "chalk"
import { Command } from "commander"

import { handleCommands, handleCrons, handleEvents } from "~/cli/handlers"
import { cliHeader, getConfig, loadingMessage } from "~/cli/utils"

import type { BuildManifest } from "./build"

export default new Command("start")
  .description("run the bot in production mode")
  .action(async () => {
    process.env.NODE_ENV = "production"

    const config = await getConfig()
    console.log(cliHeader(config))

    if (!existsSync("./.phase")) {
      throw new Error("No '.phase' directory found. Run 'phase build' first.")
    }

    if (!Bun.env.DISCORD_TOKEN) {
      throw new Error("Missing 'DISCORD_TOKEN' environment variable.")
    }

    const client = new Client(config) as Client<false>

    void loadingMessage(
      async () => {
        const { commands, crons, events, middleware, prestart } = (
          await import(`${process.cwd()}/.phase/manifest.js`)
        ).default as BuildManifest

        if (prestart) await prestart(client)

        await Promise.all([
          handleCommands(client, commands, middleware?.commands),
          handleCrons(client, crons),
          handleEvents(client, events),
        ])

        await client.login()
      },
      {
        loading: "Loading the bot ...",
        success: () =>
          `Bot is online! ${chalk.grey(`(${(Bun.nanoseconds() / 1e9).toFixed(2)}s)`)}\n`,
        error: "An error occurred while loading the bot:\n",
      },
    )
  })
