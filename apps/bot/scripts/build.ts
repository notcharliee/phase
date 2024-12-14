import { $, build, write } from "bun"
import { existsSync, rmSync, statSync } from "node:fs"
import { join } from "node:path"

import { analyseApp } from "@phasejs/loaders"

import chalk from "chalk"

import { dependencies } from "../package.json"

// main //

async function main() {
  console.log(chalk.bold.whiteBright(`☽ Building Phase`))

  // clean up
  cleanup()

  // run the steps
  await typecheck()
  await lint()
  await bundle()

  console.log(`  `)
  console.log(`${chalk.bold.greenBright(`✓`)} Build complete!`)
}

await main()

// helpers //

function remove(path: string) {
  if (!existsSync(path)) return
  const stats = statSync(path)
  rmSync(path, { recursive: stats.isDirectory() })
}

function cleanup() {
  if (!existsSync(".phase")) return

  remove(".phase/src")
  remove(".phase/assets")
  remove(".phase/chunks")
  remove(".phase/app-build-manifest.json")
}

async function cmdExists(cmd: string) {
  try {
    await $`${cmd} -v`.quiet()
    return true
  } catch {
    return false
  }
}

// steps //

async function typecheck() {
  if (!(await cmdExists("tsc"))) return
  console.log(chalk.grey(`- Validating types ...`))
  await $`tsc --noEmit`
}

async function lint() {
  if (!(await cmdExists("eslint"))) return
  console.log(chalk.grey(`- Linting code ...`))
  await $`eslint .`
}

async function bundle() {
  console.log(chalk.grey(`- Generating bundle ...`))

  const outDir = join(process.cwd(), ".phase")

  const entrypoints = Object.values({ ...(await analyseApp()) })
    .filter(Boolean)
    .flat()

  const externals = Object.keys(dependencies)

  const output = await build({
    target: "bun",
    outdir: outDir,
    entrypoints: ["src/main.ts", ...entrypoints],
    sourcemap: "external",
    external: [...externals],
    splitting: true,
    minify: true,
    naming: {
      asset: "assets/[name]-[hash].[ext]",
      chunk: "chunks/[name]-[hash].[ext]",
      entry: "[dir]/[name].[ext]",
    },
  })

  if (!output.success) {
    throw new AggregateError(output.logs, "Build failed")
  }

  const buildDir = join(outDir, "src")
  const buildPaths = await analyseApp(buildDir)

  await write(
    ".phase/app-build-manifest.json",
    JSON.stringify(buildPaths, null, 2),
  )
}
