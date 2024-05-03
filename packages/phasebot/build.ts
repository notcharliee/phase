import { $ } from "bun"
import { rmSync } from "node:fs"

import type { JSONSchemaForNPMPackageJsonFiles2 as PackageJsonFile } from "@schemastore/package"
import chalk from "chalk"

import { cliHeader } from "./src/cli/utils"

console.log(cliHeader)
console.log("  Build process started ...")
console.log("  ")

rmSync("./dist", { recursive: true })

console.log("  Building package ...")

const packageJson = (await Bun.file("./package.json").json()) as PackageJsonFile
const externalDeps = Object.keys(packageJson.dependencies!)

const packageBuild = await Bun.build({
  entrypoints: ["./src/index.ts", "./src/builders/index.ts", "./src/cli/index.ts"],
  outdir: "./dist",
  target: "bun",
  external: externalDeps,
  minify: true,
})

if (!packageBuild.success) {
  throw new AggregateError(packageBuild.logs, "Build failed")
}

console.log("  Building types ...")

await $`tsup-node ./src/index.ts ./src/builders/index.ts --dts --dts-only --minify --format=esm`.quiet()

console.log("  ")
console.log(
  `  All done! ${chalk.grey(`(${(Bun.nanoseconds() / 1e9).toFixed(2)}s)`)}`,
)
