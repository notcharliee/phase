#!/usr/bin/env node

import { existsSync, writeFileSync } from "node:fs"
import { basename } from "node:path"

import { version } from "~/index"

import {
  getBotCommands,
  handleBotCommands,
  sortBotCommandData,
} from "~/handlers/botCommands"
import { handleCronJobs } from "~/handlers/botCronJobs"
import { handleBotEvents } from "~/handlers/botEvents"

import { getConfig } from "~/utils/config"
import { getPrestart } from "~/utils/prestart"
import { cliSpinner } from "~/utils/spinner"

import chalk from "chalk"
import { Command } from "commander"
import { Client } from "discord.js"
import { config as dotenv, listFiles as listEnvFiles } from "dotenv-flow"
import { build } from "tsup"

const env = (() => {
  dotenv({
    files: [
      ".env",
      ".env.local",
      `.env.${process.env.NODE_ENV}`, // ".env.development"
      `.env.${process.env.NODE_ENV}.local`, // ".env.development.local"
    ],
  })

  return {
    files: listEnvFiles().map((path) => basename(path)),
  }
})()

export const program = new Command("phase")
  .version(version)
  .showSuggestionAfterError(true)

program
  .command("start")
  .description("Start the bot.")
  .action(async () => {
    console.log(chalk.bold(chalk.magentaBright(`\n☽︎ Phasebot v${version}`)))

    const config = await getConfig()

    if (config) {
      console.log(
        `-  Config:        ${"phase.config." + config.configPath.split(".").pop()}`,
      )
    }

    if (env.files.length) {
      console.log(`-  Environments:  ${env.files.join(" ")}`)
    }

    console.log(" ")

    // Start client

    const client = new Client(config)

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
        format: "esm",
        minify: true,
        skipNodeModulesBundle: true,
        sourcemap: true,
        splitting: true,
        treeshake: true,
        tsconfig: existsSync("./tsconfig.json") ? "./tsconfig.json" : undefined,
        outDir: "./build",
      })
    } catch (error) {
      throw error
    }
  })

program
  .command("commands")
  .description("Export commands to a JSON file.")
  .requiredOption("--outFile <PATH>", "Where to create the file file.")
  .action(async ({ outFile }: { outFile: string }) => {
    if (!outFile.endsWith(".json")) {
      throw Error("outFile path must end in '.json'")
    }

    try {
      const commands = sortBotCommandData(
        (await getBotCommands()).map((command) => command.toJSON()),
      )

      writeFileSync(outFile, JSON.stringify(commands, null, 2))
    } catch (error) {
      throw error
    }
  })

program.parse(process.argv)

if (!program.args.length) program.help()
