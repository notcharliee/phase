import { existsSync, rmSync } from "node:fs"
import { basename, extname } from "node:path"

import { Command } from "commander"
import dedent from "dedent"

import { font } from "~/../plugins"
import { getCommandPaths, getCronPaths, getEventPaths } from "~/cli/handlers"
import {
  cliHeader,
  getConfig,
  getMiddlewarePath,
  getPrestartPath,
  loadingMessage,
} from "~/cli/utils"

import type { JSONSchemaForNPMPackageJsonFiles2 as PackageJsonType } from "@schemastore/package"
import type { BotCommandMiddleware } from "~/builders"
import type {
  CommandsCollection,
  CronsCollection,
  EventsCollection,
} from "~/cli/handlers"
import type { getPrestart } from "~/cli/utils"

export interface BuildManifestPaths {
  commands: string[]
  crons: string[]
  events: string[]
  middleware: string | undefined
  prestart: string | undefined
}

export interface BuildManifest {
  commands: CommandsCollection
  crons: CronsCollection
  events: EventsCollection
  middleware: { commands?: BotCommandMiddleware } | undefined
  prestart: Awaited<ReturnType<typeof getPrestart>> | undefined
}

export default new Command("build")
  .description("build the bot for production")
  .action(async () => {
    process.env.NODE_ENV = "production"

    const config = await getConfig()
    console.log(cliHeader(config))

    const packageJson = (await Bun.file("./package.json").json()) as
      | PackageJsonType
      | undefined

    if (!existsSync("./src")) {
      throw new Error("No 'src' directory found.")
    }

    if (!Bun.env.DISCORD_TOKEN) {
      throw new Error("Missing 'DISCORD_TOKEN' environment variable.")
    }

    await loadingMessage(
      async () => {
        if (existsSync("./.phase")) {
          rmSync("./.phase", { recursive: true })
        }

        const entrypoints = (() => {
          const paths = [
            ...getCommandPaths(),
            ...getCronPaths(),
            ...getEventPaths(),
          ]

          const middlewarePath = getMiddlewarePath()
          const prestartPath = getPrestartPath()

          if (middlewarePath) paths.push(middlewarePath)
          if (prestartPath) paths.push(prestartPath)

          return paths
        })()

        const external = Object.keys(packageJson?.dependencies ?? {})

        const build = await Bun.build({
          entrypoints,
          external,
          minify: true,
          splitting: true,
          plugins: [font()],
          outdir: ".phase/build",
          root: "./src",
          naming: {
            asset: "assets/[hash].[ext]",
            chunk: "chunks/[hash].[ext]",
            entry: "[dir]/[name].[ext]",
          },
        })

        if (!build.success) {
          throw new AggregateError(build.logs, "Build failed")
        }

        const filePaths: BuildManifestPaths = {
          commands: [],
          crons: [],
          events: [],
          middleware: undefined,
          prestart: undefined,
        }

        for (const output of build.outputs) {
          const basePath = `${process.cwd().replaceAll("\\", "/")}/.phase`
          const outputPath = output.path.replaceAll("\\", "/")
          const extension = extname(outputPath)

          const directory:
            | "commands"
            | "crons"
            | "events"
            | "chunks"
            | "assets"
            | "" =
            output.kind === "chunk" || output.kind === "asset"
              ? ((output.kind + "s") as "chunks" | "assets")
              : outputPath.includes(".phase/build/commands/")
                ? "commands"
                : outputPath.includes(".phase/build/crons/")
                  ? "crons"
                  : outputPath.includes(".phase/build/events/")
                    ? "events"
                    : ""

          let filePath = `${basePath}/${directory.length ? directory + "/" : ""}`

          if (directory === "commands") {
            filePath += `${filePaths.commands.length}${extension}`
            filePaths.commands.push(filePath)
          } else if (directory === "crons") {
            filePath += `${filePaths.crons.length}${extension}`
            filePaths.crons.push(filePath)
          } else if (directory === "events") {
            filePath += `${filePaths.events.length}${extension}`
            filePaths.events.push(filePath)
          } else {
            filePath += basename(outputPath)

            if (filePath.endsWith(".phase/middleware.js")) {
              filePaths.middleware = filePath
            } else if (filePath.endsWith(".phase/prestart.js")) {
              filePaths.prestart = filePath
            }
          }

          const fileContent = (await Bun.file(output.path).text()).replace(
            /(import\s*(\{[^}]*\}\s*from\s*|))["'](\.\.?\/[^"']+)["']/g,
            (_, p1, __, p3) =>
              `${p1}"${basePath}${directory === "chunks" ? "/chunks" : ""}/${p3.replace(/(\.\.?\/)+/, "")}"`,
          )

          await Bun.write(filePath, fileContent)
        }

        rmSync("./.phase/build", { recursive: true })

        await Bun.write(
          "./.phase/manifest.js",
          dedent`
          import { Collection } from "discord.js"

          ${filePaths.commands.map((filePath, index) => `import command${index} from "${filePath}"`).join("\n")}
          ${filePaths.crons.map((filePath, index) => `import cron${index} from "${filePath}"`).join("\n")}
          ${filePaths.events.map((filePath, index) => `import event${index} from "${filePath}"`).join("\n")}
          ${filePaths.middleware ? `import * as middleware from "${filePaths.middleware}"` : ""}
          ${filePaths.prestart ? `import prestart from "${filePaths.prestart}"` : ""}
          
          export default {
            commands: new Collection([${filePaths.commands.map((_, index) => `[command${index}.name, command${index}]`).join(", ")}]),
            crons: Collection.combineEntries([${filePaths.crons.map((_, index) => `[cron${index}.pattern, [cron${index}]]`).join(", ")}], (a, b) => [...a, ...b]),
            events: Collection.combineEntries([${filePaths.events.map((_, index) => `[event${index}.name, [event${index}]]`).join(", ")}], (a, b) => [...a, ...b]),
            middleware: ${filePaths.middleware ? "middleware" : "undefined"},
            prestart: ${filePaths.prestart ? "prestart" : "undefined"},
          }
          `,
        )
      },
      {
        loading: "Building...",
        success: "Build complete!",
        error: "An error occurred while building:\n",
      },
    )
  })
