import type { BotPrestart } from "@phasejs/core"

export async function loadPrestart(path: string): Promise<BotPrestart> {
  try {
    const prestartExports = (await import(path)) as Record<string, unknown>
    return prestartExports.default as BotPrestart
  } catch (error) {
    console.error(`Failed to load prestart file:`)
    throw error
  }
}
