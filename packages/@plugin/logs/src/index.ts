import { BotPlugin } from "@phasejs/core/client"

import chalk from "chalk"

import { version as pkgVersion } from "~/../package.json"

import type { BotPluginVersion } from "@phasejs/core"
import type { BotClient } from "@phasejs/core/client"

export interface LogsPluginOptions {
  name: string
  version: string
}

export function logsPlugin(options: LogsPluginOptions) {
  const wait = chalk.bold.whiteBright("-")
  const notice = chalk.bold.blueBright("!")
  const success = chalk.bold.greenBright(`✓`)

  const startupLogs = (phase: BotClient) => {
    let initTime: number | null = null
    let readyTime: number | null = null

    void phase.emitter.once("init").then(() => {
      initTime = Date.now()

      const environment = chalk.grey(`${process.env.NODE_ENV}`)
      const platform = chalk.grey(`${process.platform} (${process.arch})`)
      const runtime = chalk.grey(
        "Bun" in globalThis
          ? `Bun ${(globalThis as unknown as { Bun: { version: string } }).Bun.version}`
          : "Deno" in globalThis
            ? `Deno ${(globalThis as unknown as { Deno: { version: string } }).Deno.version}`
            : `Node ${process.version}`,
      )

      const header = chalk.bold.whiteBright(
        `☽ ${options.name} v${options.version}`,
      )

      console.log(header)
      console.log(`  • Environment: ${environment}`)
      console.log(`  • Platform: ${platform}`)
      console.log(`  • Runtime: ${runtime}`)
      console.log(`  `)
      console.log(`${wait} Starting up ...`)
    })

    void phase.emitter.once("ready").then(() => {
      readyTime = Date.now()

      const secondsToReady = (readyTime - initTime!) / 1000
      const formattedReadyTime = chalk.grey(`(${secondsToReady.toFixed(2)}s)`)

      console.log(`${success} Ready! ${formattedReadyTime}`)
      console.log(`  `)

      initTime = null
      readyTime = null
    })
  }

  const liveCommandLogs = (phase: BotClient) => {
    void phase.emitter.on("liveCommandCreate", ({ name }) => {
      console.log(`${notice} Created '${name}' command.`)
    })

    void phase.emitter.on("liveCommandDelete", ({ name }) => {
      console.log(`${notice} Deleted '${name}' command.`)
    })

    void phase.emitter.on("liveCommandUpdate", ({ name }) => {
      console.log(`${notice} Updated '${name}' command.`)
    })
  }

  return new BotPlugin({
    name: "Logs",
    trigger: "init",
    version: pkgVersion as BotPluginVersion,
    onLoad(phase) {
      startupLogs(phase)
      liveCommandLogs(phase)
    },
  })
}
