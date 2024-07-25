import { existsSync, rmSync } from "node:fs"
import { platform } from "node:os"

import { Command } from "commander"

import { font } from "~/../plugins"
import { cliHeader, getConfig, loadingMessage } from "~/cli/utils"

import type { JSONSchemaForNPMPackageJsonFiles2 as PackageJsonType } from "@schemastore/package"

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

    await loadingMessage(
      async () => {
        if (existsSync("./.phase")) {
          rmSync("./.phase", { recursive: true })
        }

        const entrypoints = Array.from(
          new Bun.Glob("./src/**/*").scanSync({
            absolute: true,
          }),
        )

        const external = Object.keys(packageJson?.dependencies ?? {})

        const build = await Bun.build({
          entrypoints,
          external,
          minify: platform() !== "win32", // bug in bun build for windows
          splitting: platform() !== "win32", // bug in bun build for windows,
          plugins: [font()],
          sourcemap: "inline",
          outdir: ".phase",
          root: "./src",
        })
        

        if (!build.success) {
          throw new AggregateError(build.logs, "Build failed")
        }
      },
      {
        loading: "Building...",
        success: "Build complete!",
        error: "An error occurred while building:\n",
      },
    )
  })
