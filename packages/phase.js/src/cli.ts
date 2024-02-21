#!/usr/bin/env node

import { existsSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"

import { version } from "~/index"

import { handleBotCommands } from "~/handlers/botCommands"
import { handleBotEvents } from "~/handlers/botEvents"
import { handleCronJobs } from "~/handlers/cronJobs"

import { getAllFiles } from "~/utils/getAllFiles"
import { getConfig } from "~/utils/config"
import { getEnv } from "~/utils/dotenv"
import { getPrestart } from "~/utils/prestart"
import { cliSpinner } from "~/utils/spinner"

import { sync as rimrafSync } from "rimraf"
import { build } from "esbuild"
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
        "Prestart complete."
      )

      const events = await cliSpinner(
        handleBotEvents(client),
        "Loading bot events...",
        "Bot events loaded."
      )

      await cliSpinner(
        handleBotCommands(client),
        "Loading bot commands...",
        "Bot commands loaded."
      )

      await cliSpinner(
        handleCronJobs(client),
        "Loading cron jobs...",
        "Cron jobs loaded."
      )
  
      await cliSpinner(
        client.login(token),
        "Connecting to Discord...",
        "Connected to Discord.\n"
      )

      for (const readyEvent of Object.values(events).filter(e => e.name === "ready"))
        readyEvent.execute(client as Client<true>, client as Client<true>)
    } catch (error) {
      throw error
    }
  })


program.command("build")
  .description("Build the bot.")
  .action(() => {
    const srcPath = resolve(process.cwd(), "src")
    const buildPath = resolve(process.cwd(), "build")

    if (!existsSync(pathToFileURL(srcPath))) throw new Error("No 'src' directory found.")

    if (existsSync(pathToFileURL(buildPath))) rimrafSync(resolve(buildPath))

    try {
      build({
        bundle: true,
        entryPoints: getAllFiles(srcPath),
        format: "cjs",
        platform: "node",
        tsconfig: "../tsconfig.json",
        outdir: buildPath,
        outExtension: {
          ".js": ".cjs",
        },
      }).then((result) => {
        console.log(result)
      })
    } catch (error) {
      throw error
    }
  })


program.parse(process.argv)

if (!program.args.length)
  program.help()