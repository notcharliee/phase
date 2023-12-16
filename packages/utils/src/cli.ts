#!/usr/bin/env node

import { PhaseConfig } from './index.js'
import { Command } from "commander"
import { spawn } from "child_process"
import { pathToFileURL } from 'url'
import { getEnvVariables } from "./index.js"
import { copyFileSync } from 'fs'
import { resolve } from "path"
import packageJson from "../package.json"
import chalk from 'chalk'


// Commands


const cli = new Command()
.name(packageJson.name)
.version(packageJson.version)


cli
.command("build")
.description("Runs an app's build script.")
.requiredOption(
  "-a, --app <STRING>",
  "Specify the app.",
)
.action(async options => {
  const config = await getPhaseConfig()
  const script = config.scripts.find(script => script.app == options.app)

  if (!script || !script.build) {
    console.log(
      `${chalk.redBright(chalk.bold("Error:"))} Build Script Not Found\n`,
      `${chalk.redBright(chalk.bold("↳"))} `,
      `Could not find a build script for '${options.app}' in 'phase.config.js'.`,
    )

    process.exit()
  }
  
  spawnChildProcess(script.build, resolve(process.cwd(), 'apps', script.app))
})


cli
.command("start")
.description("Runs an app's start script.")
.requiredOption(
  "-a, --app <STRING>",
  "Specify the app.",
)
.action(async options => {
  const config = await getPhaseConfig()
  const script = config.scripts.find(script => script.app == options.app)

  if (!script || !script.start) {
    console.log(
      `${chalk.redBright(chalk.bold("Error:"))} Start Script Not Found\n`,
      `${chalk.redBright(chalk.bold("↳"))} `,
      `Could not find a start script for '${options.app}' in 'phase.config.js'.`,
    )

    process.exit()
  }
  
  spawnChildProcess(script.start, resolve(process.cwd(), 'apps', script.app))
})


cli
.command("dev")
.description("Runs an app's dev script.")
.requiredOption(
  "-a, --app <STRING>",
  "Specify the app.",
)
.action(async options => {
  const config = await getPhaseConfig()
  const script = config.scripts.find(script => script.app == options.app)

  if (!script || !script.dev) {
    console.log(
      `${chalk.redBright(chalk.bold("Error:"))} Dev Script Not Found\n`,
      `${chalk.redBright(chalk.bold("↳"))} `,
      `Could not find a dev script for '${options.app}' in 'phase.config.js'.`,
    )

    process.exit()
  }
  
  spawnChildProcess(script.dev, resolve(process.cwd(), 'apps', script.app))
})


cli.parse(process.argv)


// Functions //


/**
 * Spawns a child process with the given command.
 *
 * @param command - The command to be executed, including any arguments.
 * @param cwd - The cwd path of the child process.
 */
function spawnChildProcess(command: string, cwd: string) {
  const globalEnvVariables = getEnvVariables(resolve(cwd, "..", "..", ".env"))
  if (globalEnvVariables) copyFileSync(resolve(cwd, "..", "..", ".env"), resolve(cwd, ".env.local"))

  process.env = { ...globalEnvVariables, ...process.env } ?? process.env
  process.env.FORCE_COLOR = "true"

  const [ cmd, ...args ] = command.split(" ")
  const childProcess = spawn(process.platform == "win32" ? cmd.replace("npm", "npm.cmd").replace("npx", "npx.cmd") : cmd, args, { cwd, env: process.env })


  childProcess.on("error", (error) => { throw error })
  childProcess.stdout.on("data", (data) => { console.log(`${data}`.split("\n").length == 2 ? `${data}`.replace("\n","") : `${data}`) })
}


/**
 * Gets the Phase config.
 */
async function getPhaseConfig() {
  const configPath = resolve(process.cwd(), 'phase.config.js')
  
  try {
    const config = (await import(pathToFileURL(configPath).toString())).default
    return config as PhaseConfig
  } catch (error) {
    console.log(
      `${chalk.redBright(chalk.bold("Error:"))} Config not found\n`,
      `${chalk.redBright(chalk.bold("↳"))} `,
      "Could not find a 'phase.config.js' file in the current working directory.\n",
    )

    console.log(
      `${chalk.magenta(chalk.bold("How to Fix:"))}\n`,
      `${chalk.magenta(chalk.bold("↳"))} `,
      "If no 'phase.config.js' file exists in your project, create one to use the CLI.\n",
      `${chalk.magenta(chalk.bold("↳"))} `,
      "If one does exist, make sure you're running the command in the same directory as the file."
    )

    process.exit(1)
  }
}