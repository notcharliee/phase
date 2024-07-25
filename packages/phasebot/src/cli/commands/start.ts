import { existsSync } from "node:fs"

import { Command } from "commander"

import { startBot } from "~/cli/handlers"
import { cliHeader, getConfig } from "~/cli/utils"

export default new Command("start")
  .description("run the bot in production mode")
  .action(async () => {
    process.env.NODE_ENV = "production"

    const config = await getConfig()
    console.log(cliHeader(config))

    if (!existsSync("./src")) {
      throw new Error("No 'src' directory found.")
    }

    if (!Bun.env.DISCORD_TOKEN) {
      throw new Error("Missing 'DISCORD_TOKEN' environment variable.")
    }

    startBot(config)
  })
