import type { BotMiddleware } from "@phasejs/core"

export async function loadMiddleware(path: string): Promise<BotMiddleware> {
  try {
    const middlewareExports = (await import(path)) as Record<string, unknown>
    return middlewareExports as BotMiddleware
  } catch (error) {
    console.error(`Failed to load middleware file:`)
    throw error
  }
}
