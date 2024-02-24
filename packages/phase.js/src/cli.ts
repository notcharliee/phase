#!/usr/bin/env node

import { existsSync } from "node:fs"

import { version } from "~/index"

import { handleBotCommands } from "~/handlers/botCommands"
import { handleBotEvents } from "~/handlers/botEvents"
import { handleCronJobs } from "~/handlers/botCronJobs"

import { getConfig } from "~/utils/config"
import { getEnv } from "~/utils/dotenv"
import { getPrestart } from "~/utils/prestart"
import { cliSpinner } from "~/utils/spinner"

import { build } from "tsup"
import { Client } from "discord.js"
import { Command } from "commander"
import chalk from "chalk"

export const program = new Command("phase")
  .version(version)
  .showSuggestionAfterError(true)

program
  .command("start")
  .description("Start the bot.")
  .action(async () => {
    console.log(chalk.bold(chalk.magentaBright(`\n🌕︎ Phase.js v${version}`)))

    const config = await getConfig()
    if (config)
      console.log(
        `-  Config:        ${"phase.config." + config.configPath.split(".").pop()}`,
      )

    const env = getEnv()
    if (env.files.length)
      console.log(`-  Environments:  ${env.files.join(" ")}\n`)

    // Start client

    const client = new Client(config.clientOptions)

    try {
      const token = process.env.BOT_TOKEN
      if (!token) throw new Error("Missing 'BOT_TOKEN' environment variable.")

      const runPrestart = async () => {
        const prestartFn = await getPrestart()
        return await prestartFn()
      }

      await cliSpinner(
        runPrestart(),
        "Executing prestart...",
        "Prestart complete.",
      )

      await cliSpinner(
        handleBotEvents(client),
        "Loading bot events...",
        "Bot events loaded.",
      )

      await cliSpinner(
        handleBotCommands(client),
        "Loading bot commands...",
        "Bot commands loaded.",
      )

      await cliSpinner(
        handleCronJobs(client),
        "Loading cron jobs...",
        "Cron jobs loaded.",
      )

      await cliSpinner(
        client.login(token),
        "Connecting to Discord...",
        "Connected to Discord.\n",
      )
    } catch (error) {
      throw error
    }
  })

program
  .command("build")
  .description("Build the bot.")
  .action(() => {
    if (!existsSync("./src")) throw new Error("No 'src' directory found.")

    try {
      build({
        bundle: true,
        clean: true,
        entry: ["./src"],
        format: "cjs",
        minify: true,
        skipNodeModulesBundle: true,
        splitting: true,
        treeshake: true,
        tsconfig: "../tsconfig.json",
        outDir: "./build",
        outExtension() {
          return { js: ".cjs" }
        },
      })
    } catch (error) {
      throw error
    }
  })

program.parse(process.argv)

if (!program.args.length) program.help()
