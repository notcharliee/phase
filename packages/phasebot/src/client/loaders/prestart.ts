import type { BotPrestart } from "~/types/prestart"

export async function loadPrestartFile(path: string): Promise<BotPrestart> {
  try {
    const prestartExports = (await import(path)) as Record<string, unknown>
    return prestartExports.default as BotPrestart
  } catch (error) {
    console.error(`Failed to load prestart file:`)
    throw error
  }
}
