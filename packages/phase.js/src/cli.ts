#!/usr/bin/env node

import { execSync } from "node:child_process"
import { existsSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"

import { sync as rimrafSync } from "rimraf"

import { getConfig, getEnv, version } from "~/index"
import { getAllFiles } from "~/utils/getAllFiles"
import { cliSpinner } from "~/utils/spinner"

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
  
      await cliSpinner(
        client.login(token),
        "Connecting to Discord...",
        "Connected successfully."
      )

      if (client.isReady()) console.log(`-  ${chalk.bold(client.user.username)} is online.\n`)
    } catch (error) {
      throw error
    }

    /**
     * todo:
     * add command handling
     * add regular event handling
     * add specialised event functions e.g. buttons, modals
     */
  })


program.command("build")
  .description("Build the bot.")
  .action(() => {
    const srcPath = resolve(process.cwd(), "src")
    const buildPath = resolve(process.cwd(), "build")

    if (!existsSync(pathToFileURL(srcPath))) throw new Error("No 'src' directory found.")

    if (existsSync(pathToFileURL(buildPath))) rimrafSync(resolve(buildPath))

    const runBuild: Promise<Buffer> = new Promise((resolve, reject) => {
      try {
        const output = execSync(`bun build ${getAllFiles(srcPath).join(" ")} --minify --target=node --outdir=build`)
        resolve(output)
      } catch (error) {
        reject(error)
      }
    })

    try {
      cliSpinner(runBuild, "Building the bot...", "Bot built successfully.")
        .then((buffer) => process.stdout.write(buffer))
    } catch (error) {
      throw error
    }
  })


program.parse(process.argv)

if (!program.args.length)
  program.help()