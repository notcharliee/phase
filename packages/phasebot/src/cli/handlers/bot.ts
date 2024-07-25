import { Client } from "discord.js"

import chalk from "chalk"

import { getPrestart, loadingMessage } from "../utils"
import { handleCommands } from "./commands"
import { handleCrons } from "./crons"
import { handleEvents } from "./events"

import type { Config } from "~/config"

export const startBot = async (config: Config) => {
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
}
