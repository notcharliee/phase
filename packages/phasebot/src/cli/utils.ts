import { basename } from "node:path"
import { clearLine, moveCursor } from "node:readline"

import chalk from "chalk"
import gradient from "gradient-string"

import { version as packageVersion } from "~/../package.json"

import type { BotCommandMiddleware } from "~/builders"
import type { Config } from "~/config"
import type { Client } from "discord.js"

export const getConfig = async () => {
  const configPaths = Array.from(
    new Bun.Glob("phase.config.{ts,js,cjs,mjs}").scanSync({
      absolute: true,
    }),
  )

  if (configPaths.length > 1) {
    throw new Error(
      `Multiple config files found:\n${configPaths.map((path) => `  - "${path}"`).join("\n")}`,
    )
  }

  const configPath = configPaths[0]

  if (!configPath) {
    throw new Error(
      "Config file not found. Please make a 'phase.config.{ts,js,cjs,mjs}' file.",
    )
  }

  const defaultExport = await import(configPath).then((m) => m.default)

  if (!defaultExport) {
    throw new Error(`Config file is missing a default export.`)
  }

  return {
    ...(defaultExport as Config),
    configPath,
  }
}

export const getMiddlewarePath = () => {
  const dir = Bun.env.NODE_ENV !== "production" ? "src" : ".phase"

  return Array.from(
    new Bun.Glob(`${dir}/middleware.{js,ts,jsx,tsx}`).scanSync({
      absolute: true,
    }),
  )[0]
}

export const getMiddleware = async () => {
  const path = getMiddlewarePath()
  if (!path) return undefined

  const middlewares = await import(path).then((m) => ({
    commands: m.commands as unknown,
  }))

  if (middlewares.commands) {
    if (middlewares.commands instanceof Function) {
      return middlewares.commands as BotCommandMiddleware
    } else {
      throw new Error(`Invalid 'commands' export in middleware file`)
    }
  }
}

export const getPrestartPath = () => {
  const dir = Bun.env.NODE_ENV !== "production" ? "src" : ".phase"

  return Array.from(
    new Bun.Glob(`${dir}/prestart.{js,ts,jsx,tsx}`).scanSync({
      absolute: true,
    }),
  )[0]
}

export const getPrestart = async () => {
  const path = getPrestartPath()
  if (!path) return undefined

  const prestart = (await import(path).then((m) => m.default)) as unknown

  if (prestart) {
    if (prestart instanceof Function) {
      return prestart as (client: Client<false>) => void | Promise<void>
    } else {
      throw new Error(`Invalid 'default' export in prestart file`)
    }
  }
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
