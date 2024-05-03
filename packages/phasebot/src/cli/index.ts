#!/usr/bin/env bun
import { existsSync } from "node:fs"
import { basename } from "node:path"
import { clearLine, cursorTo } from "node:readline"
import { isAsyncFunction } from "node:util/types"

import { default as chalk } from "chalk"
import { Command } from "commander"

import { version as packageVersion } from "~/../package.json"
import {
  getCommands,
  handleCommands,
  updateCommands,
} from "~/cli/handlers/commands"
import { getCrons, handleCrons } from "~/cli/handlers/crons"
import { getEvents, handleEvents } from "~/cli/handlers/events"
import { getMiddleware } from "~/cli/handlers/middleware"
import { getPrestart } from "~/cli/handlers/prestart"

import { PhaseClient } from "./client"
import { cliHeader, getConfig, getEnvironments, phaseGradient } from "./utils"

const program = new Command("phase")

program.version(packageVersion)
program.showSuggestionAfterError(true)
program.addHelpText("afterAll", phaseGradient("\nThanks for using phasebot! ♡"))

program.action(async () => {
  const config = await getConfig()
  const environments = (await getEnvironments()).join(" ")

  if (!existsSync("./src")) {
    throw new Error("No 'src' directory found.")
  }

  if (!Bun.env.BOT_TOKEN) {
    throw new Error("Missing 'BOT_TOKEN' environment variable.")
  }

  console.log(cliHeader)
  console.log(`  Config:       ${chalk.grey(basename(config.configPath))}`)
  console.log(`  Environments: ${chalk.grey(environments)}`)
  console.log(`  `)

  process.stdout.write(`◌ Loading required files`)

  const client = new PhaseClient(config)

  client.token = Bun.env.BOT_TOKEN

  client.commands = await getCommands()
  client.crons = await getCrons()
  client.events = await getEvents()

  client.middleware = await getMiddleware()
  client.prestart = await getPrestart()

  handleCommands(client)
  handleCrons(client)
  handleEvents(client)

  clearLine(process.stdout, 0)
  cursorTo(process.stdout, 0)
  process.stdout.write(`${chalk.greenBright("✓")} Loading required files\n`)

  if (client.prestart) {
    process.stdout.write(`◌ Executing prestart`)

    const isAsync = isAsyncFunction(client.prestart)
    if (isAsync) await client.prestart(client)
    else client.prestart(client)

    clearLine(process.stdout, 0)
    cursorTo(process.stdout, 0)
    process.stdout.write(`${chalk.greenBright("✓")} Executing prestart\n`)
  }

  process.stdout.write(`◌ Establishing connection`)

  await client.login()

  clearLine(process.stdout, 0)
  cursorTo(process.stdout, 0)
  process.stdout.write(`${chalk.greenBright("✓")} Establishing connection\n`)

  process.stdout.write(
    `\n${chalk.greenBright("✓")} Bot is online! ${chalk.grey(`(${(Bun.nanoseconds() / 1e9).toFixed(2)}s)`)}\n`,
  )

  updateCommands(client)
})

program.parse(process.argv)
