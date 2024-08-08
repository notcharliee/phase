import { readdirSync } from "node:fs"
import { extname, join } from "node:path"

import type { BotCommandExecute } from "~/builders"
import type { ChatInputCommandInteraction } from "discord.js"

export type BotCommandMiddleware = (
  interaction: ChatInputCommandInteraction,
  execute: BotCommandExecute,
  metadata: object,
) => unknown | Promise<unknown>

export interface BotMiddleware {
  commands?: BotCommandMiddleware
}

export async function loadMiddlewareFile() {
  const allowedFileExtensions = [".js", ".cjs", ".mjs"]

  if ("Bun" in globalThis || "Deno" in globalThis) {
    allowedFileExtensions.push(".ts", ".cts", ".mts")
  }

  const middlewareFiles = readdirSync("./src").filter(
    (dirent) =>
      dirent.startsWith("middleware") &&
      allowedFileExtensions.includes(extname(dirent)),
  )

  if (!middlewareFiles.length) {
    return undefined
  }

  if (middlewareFiles.length > 1) {
    throw new Error(
      `You can only have one middleware file. Please delete or rename the other files.`,
    )
  }

  const filePath = join(process.cwd(), "src", middlewareFiles[0]!)

  const middleware = await import(filePath)
    .catch(() => null)
    .then((m) => m as BotMiddleware)

  return middleware
}
