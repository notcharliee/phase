import { $ } from "bun"
import { rmSync } from "node:fs"

import chalk from "chalk"

import type { JSONSchemaForNPMPackageJsonFiles2 as PackageJsonFile } from "@schemastore/package"

console.log("Build process started ...")

rmSync("./dist", { recursive: true })

const packageJson = (await Bun.file("./package.json").json()) as PackageJsonFile
const externalDeps = Object.keys(packageJson.dependencies!)

Bun.build({
  entrypoints: [
    "./src/index.ts",
    "./src/builders/index.ts",
    "./src/plugins/font.ts",
    "./src/cli/index.ts",
  ],
  outdir: "./dist",
  target: "bun",
  external: externalDeps,
  minify: true,
}).then((build) => {
  if (!build.success) {
    throw new AggregateError(build.logs, "Build failed")
  }
})

await $`tsup ./src/index.ts ./src/builders/index.ts --dts --dts-only --minify --format=esm`.quiet()

await Bun.write(
  "./dist/declarations.d.ts",
  await Bun.file("./src/declarations.d.ts").text(),
)

console.log(
  `${chalk.greenBright("All done!")} ${chalk.grey(`(${(Bun.nanoseconds() / 1e9).toFixed(2)}s)`)}`,
)
