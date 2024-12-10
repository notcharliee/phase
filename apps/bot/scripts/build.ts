import fs from "node:fs"
import path from "node:path"

import { BotClient } from "@phasejs/core/client"

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

void main()

// helpers //

function remove(path: string) {
  if (!fs.existsSync(path)) return
  const stats = fs.statSync(path)
  fs.rmSync(path, { recursive: stats.isDirectory() })
}

function cleanup() {
  remove(".phase/src")
  remove(".phase/assets")
  remove(".phase/chunks")
  remove(".phase/app-build-manifest.json")
}

async function cmdExists(cmd: string) {
  try {
    await Bun.$`${cmd} -v`.quiet()
    return true
  } catch {
    return false
  }
}

// steps //

async function typecheck() {
  if (!(await cmdExists("tsc"))) return
  console.log(chalk.grey(`- Validating types ...`))
  await Bun.$`tsc --noEmit`
}

async function lint() {
  if (!(await cmdExists("eslint"))) return
  console.log(chalk.grey(`- Linting code ...`))
  await Bun.$`eslint .`
}

async function bundle() {
  console.log(chalk.grey(`- Generating bundle ...`))

  const outDir = path.join(process.cwd(), ".phase")

  const entrypoints = Object.values({ ...(await BotClient.analyseApp()) })
    .filter(Boolean)
    .flat()

  const externals = Object.keys(dependencies)

  const output = await Bun.build({
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

  const buildDir = path.join(outDir, "src")
  const buildPaths = await BotClient.analyseApp(buildDir)

  await Bun.write(
    ".phase/app-build-manifest.json",
    JSON.stringify(buildPaths, null, 2),
  )
}
