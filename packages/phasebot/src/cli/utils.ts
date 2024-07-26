import { basename } from "node:path"
import { clearLine, moveCursor } from "node:readline"

import chalk from "chalk"
import gradient from "gradient-string"

import { version as packageVersion } from "~/../package.json"

import type { BotCommandMiddleware } from "~/builders"
import type { Config } from "~/config"
import type { Client } from "discord.js"

export const getConfig = async () => {
  const glob = new Bun.Glob("phase.config.{js,cjs,mjs,ts}")
  const filePath = (await Array.fromAsync(glob.scan({ absolute: true })))[0]

  if (!filePath) {
    throw new Error(
      "Config file not found. Please make a 'phase.config.{js,cjs,mjs,ts}' file.",
    )
  }

  const fileExports = await import(filePath)
  const defaultExport = fileExports.default as unknown

  if (defaultExport) {
    if (typeof defaultExport === "object") {
      return { ...(defaultExport as Config), configPath: filePath }
    } else {
      throw new Error(`Invalid 'default' export in config file`)
    }
  }

  throw new Error(`Config file is missing a default export.`)
}

export const getMiddleware = async () => {
  const glob = new Bun.Glob("src/middleware.{js,ts,jsx,tsx}")
  const filePath = (await Array.fromAsync(glob.scan({ absolute: true })))[0]

  if (!filePath) return null

  const fileExports = await import(filePath)
  const commandsExport = fileExports.commands as unknown

  if (commandsExport) {
    if (commandsExport instanceof Function) {
      return commandsExport as BotCommandMiddleware
    } else {
      throw new Error(`Invalid 'commands' export in middleware file`)
    }
  }

  return null
}

export const getPrestart = async () => {
  const glob = new Bun.Glob("src/prestart.{js,ts,jsx,tsx}")
  const filePath = (await Array.fromAsync(glob.scan({ absolute: true })))[0]

  if (!filePath) return null

  const fileExports = await import(filePath)
  const defaultExport = fileExports.default as unknown

  if (defaultExport) {
    if (defaultExport instanceof Function) {
      type PrestartFunction = (client: Client<false>) => void | Promise<void>
      return defaultExport as PrestartFunction
    } else {
      throw new Error(`Invalid 'default' export in prestart file`)
    }
  }

  return null
}

export const phaseGradient = gradient(["#DB00FF", "#8000FF"])

export const cliHeader = (config: Awaited<ReturnType<typeof getConfig>>) => {
  const header = phaseGradient(`☽ PhaseBot v${packageVersion}`)
  return `${chalk.bold(header)}\n  Config:       ${chalk.grey(basename(config.configPath))}\n  Environment:  ${chalk.grey(Bun.env.NODE_ENV ?? "development")}\n`
}

export const loadingMessage = async <TResult>(
  fn: () => Promise<TResult>,
  text: {
    loading: string | (() => string)
    success: string | (() => string)
    error?: string | (() => string)
  },
  icon?: {
    loading?: string
    success?: string
    error?: string
  },
): Promise<TResult> => {
  const stdout = process.stdout as unknown as NodeJS.WritableStream

  const getText = (text: string | (() => string)) =>
    typeof text === "function" ? text() : text

  try {
    console.log(`${icon?.loading ?? "◌"} ${getText(text.loading)}`)

    const result = await fn()

    moveCursor(stdout, 0, -1)
    clearLine(stdout, 1)

    console.log(
      `${icon?.success ?? chalk.greenBright("✓")} ${getText(text.success)}`,
    )

    return result
  } catch (error) {
    moveCursor(stdout, 0, -1)
    clearLine(stdout, 1)

    console.log(
      `${icon?.error ?? chalk.redBright("✗")} ${text.error ? getText(text.error) : "An error occured.\n"}`,
    )

    throw error
  }
}
