#!/usr/bin/env node

import { getConfig, getEnv, version } from "~/index"
import { startBot } from "./handlers/startBot"

import { Client } from "discord.js"
import { Command } from "commander"
import chalk from "chalk"


export const program = new Command("phase")
  .version(version)
  .showSuggestionAfterError(true)


program.command("start")
  .description("Start the bot.")
  .action(async () => {
    console.log(chalk.bold(chalk.magentaBright(`\n🌕︎ Phase.js v${version}`)))

    const config = await getConfig()
    if (config) console.log(`-  Config:        ${"phase.config." + config.configPath.split(".").pop()}`)

    const env = getEnv()
    if (env.files.length) console.log(`-  Environments:  ${env.files.join(" ")}\n`)

    // ----------------------------------- //

    const client = await startBot(new Client(config.clientOptions))

    console.log(`-  ${chalk.bold(client.user.username)} is online.\n`)

    /**
     * todo:
     * add phase build command
     * add command handling (requires build)
     * add regular event handling (requires build)
     * add specialised event functions e.g. buttons, modals (requires build)
     */
  })


program.parse(process.argv)

if (!program.args.length)
  program.help()