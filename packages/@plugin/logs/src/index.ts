import { BotPlugin } from "@phasejs/core/client"

import chalk from "chalk"

import { version as pkgVersion } from "~/../package.json"

import type { BotPluginVersion } from "@phasejs/core"

export function logsPlugin({
  name,
  version,
}: {
  name: string
  version: string
}) {
  return new BotPlugin({
    name: "Logs",
    trigger: "init",
    version: pkgVersion as BotPluginVersion,
    onLoad(phase) {
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

        console.log(chalk.whiteBright(`☽ ${name} v${version}`))
        console.log(`  • Environment: ${environment}`)
        console.log(`  • Platform: ${platform}`)
        console.log(`  • Runtime: ${runtime}`)
        console.log(`  `)
        console.log(`- Starting up ...`)
      })

      void phase.emitter.once("ready").then(() => {
        readyTime = Date.now()

        const readyIn = ((readyTime - initTime!) / 1000).toFixed(2)

        console.log(
          `${chalk.greenBright(`✓`)} Ready! ${chalk.grey(`(${readyIn}s)`)}`,
        )

        initTime = null
        readyTime = null
      })
    },
  })
}
