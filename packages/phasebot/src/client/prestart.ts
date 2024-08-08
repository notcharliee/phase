import { readdirSync } from "node:fs"
import { extname, join } from "node:path"

import type { Client } from "discord.js"

export type BotPrestart = (client: Client<false>) => void | Promise<void>

export async function getPrestartPath() {
  const allowedFileExtensions = [".js", ".cjs", ".mjs"]

  if ("Bun" in globalThis || "Deno" in globalThis) {
    allowedFileExtensions.push(".ts", ".cts", ".mts")
  }

  const prestartFiles = readdirSync("./src").filter(
    (dirent) =>
      dirent.startsWith("prestart") &&
      allowedFileExtensions.includes(extname(dirent)),
  )

  if (!prestartFiles.length) {
    return undefined
  }

  if (prestartFiles.length > 1) {
    throw new Error(
      `You can only have one prestart file. Please delete or rename the other files.`,
    )
  }

  return join(process.cwd(), "src", prestartFiles[0]!)
}

export async function loadPrestartFile(filePath: string) {
  const prestart = await import(filePath)
    .catch(() => null)
    .then((m) => m?.default as BotPrestart | undefined)

  if (!prestart) {
    throw new Error("Prestart file is missing a default export.")
  }

  return prestart
}
