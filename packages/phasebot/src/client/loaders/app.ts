import { existsSync, readdirSync, statSync } from "node:fs"
import { basename, extname, join } from "node:path"

import { validExtnames } from "~/shared/utils"

export function analyseApp() {
  const srcDirPath = join(process.cwd(), "src")
  const appDirPath = join(srcDirPath, "app")

  if (!existsSync(srcDirPath)) {
    throw new Error("No source directory found.")
  }

  if (!existsSync(appDirPath)) {
    throw new Error("No app directory found.")
  }

  const srcDirContentPaths: {
    middleware: string | undefined
    prestart: string | undefined
  } = {
    middleware: undefined,
    prestart: undefined,
  }

  const appDirContentPaths: {
    // middleware: string[]
    commands: string[]
    crons: string[]
    events: string[]
  } = {
    // middleware: [],
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
        entryPath,
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
