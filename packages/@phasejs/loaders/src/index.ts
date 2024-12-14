import { existsSync, readdirSync, statSync } from "node:fs"
import { basename, extname, join } from "node:path"

import { defaultValidExtnames } from "~/lib/constants"

import { loadCommands } from "~/loaders/commands"
import { loadCrons } from "~/loaders/crons"
import { loadEvents } from "~/loaders/events"
import { loadMiddleware } from "~/loaders/middleware"
import { loadPrestart } from "~/loaders/prestart"

import type { BotClient } from "@phasejs/core/client"
import type { AppManifest } from "~/types/manifest"

// load app //

export async function loadApp(phase: BotClient, paths?: AppManifest) {
  if (!paths) paths = await analyseApp()

  const prestart = paths.prestart
    ? await loadPrestart(paths.prestart)
    : undefined

  const middlewares = paths.middleware
    ? await loadMiddleware(paths.middleware)
    : undefined

  const [commands, crons, events] = await Promise.all([
    loadCommands(phase.client, paths.commands),
    loadCrons(phase.client, paths.crons),
    loadEvents(phase.client, paths.events),
  ])

  return {
    prestart,
    middlewares,
    commands,
    crons,
    events,
  }
}

// analyse app //

export async function analyseApp(
  srcDir?: string,
  validExtnames: string[] = defaultValidExtnames,
): Promise<AppManifest> {
  const manifestFile = Bun.file("./app-build-manifest.json")

  if (await manifestFile.exists()) {
    const manifest = (await manifestFile.json()) as AppManifest
    return manifest
  }

  const srcDirPath = srcDir ?? join(process.cwd(), "src")
  const appDirPath = join(srcDirPath, "app")

  if (!existsSync(srcDirPath)) {
    throw new Error("No source directory found.")
  }

  if (!existsSync(appDirPath)) {
    throw new Error("No app directory found.")
  }

  const srcDirContentPaths: Pick<AppManifest, "middleware" | "prestart"> = {
    middleware: undefined,
    prestart: undefined,
  }

  const appDirContentPaths: Omit<AppManifest, "middleware" | "prestart"> = {
    commands: [],
    crons: [],
    events: [],
  }

  const analyseSrcDirectory = (dirPath: string) => {
    const dirEntries = readdirSync(dirPath)
    const validBasenames = Object.keys(srcDirContentPaths)

    for (const entry of dirEntries) {
      const entryExtname = extname(entry)
      const entryBasename = basename(entry, entryExtname)

      if (!validExtnames.includes(entryExtname)) continue
      if (!validBasenames.includes(entryBasename)) continue

      srcDirContentPaths[entryBasename as keyof typeof srcDirContentPaths] =
        join(dirPath, entry)
    }
  }

  const analyseContentDirectory = (
    accPaths: string[],
    currentDirPath: string,
  ) => {
    const entries = readdirSync(currentDirPath)

    for (const entry of entries) {
      if (entry.startsWith("_")) continue

      const entryPath = join(currentDirPath, entry)
      const entryStats = statSync(entryPath)

      if (entryStats.isDirectory()) {
        analyseContentDirectory(accPaths, entryPath)
      } else if (validExtnames.includes(extname(entry))) {
        accPaths.push(entryPath)
      }
    }

    return accPaths
  }

  const analyseAppDirectory = (dirPath: string) => {
    const dirEntries = readdirSync(dirPath)
    const validBasenames = Object.keys(appDirContentPaths)

    for (const entry of dirEntries) {
      if (entry.startsWith("_")) continue

      const entryPath = join(dirPath, entry)
      const entryStats = statSync(entryPath)

      if (!entryStats.isDirectory()) {
        console.warn(`Invalid file found in app directory: ${entry}`)
        continue
      }

      if (entry.startsWith("(") && entry.endsWith(")")) {
        analyseAppDirectory(entryPath)
      }

      if (!validBasenames.includes(entry)) {
        console.warn(`Invalid subdirectory found in app directory: ${entry}`)
        continue
      }

      appDirContentPaths[entry as keyof typeof appDirContentPaths].push(
        ...analyseContentDirectory([], entryPath),
      )
    }
  }

  analyseSrcDirectory(srcDirPath)
  analyseAppDirectory(appDirPath)

  return {
    ...srcDirContentPaths,
    ...appDirContentPaths,
  }
}

// exports //

export * from "~/lib/constants"
export * from "~/types/manifest"
