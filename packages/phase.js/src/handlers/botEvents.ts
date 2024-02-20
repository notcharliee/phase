import { existsSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"

import { getAllFiles } from "~/utils/getAllFiles"
import type { BotEvent } from "~/utils/botEvent"

import { Client } from "discord.js"


export const handleBotEvents = async (client: Client<boolean>) => {
  const events: Record<string, ReturnType<BotEvent>> = {}
  const eventDir = resolve(process.cwd(), "build/events")

  if (!existsSync(pathToFileURL(eventDir))) return events

  for (const eventFile of getAllFiles(eventDir)) {
    try {
      const eventFunction: ReturnType<BotEvent> = await (await import(pathToFileURL(eventFile).toString())).default
      events[eventFunction.name] = eventFunction

      if (eventFunction.name !== "ready") client.once("ready", (readyClient) => {
        client.on(eventFunction.name, (...data) => eventFunction.execute(readyClient, ...data))
      })
    } catch (error) {
      throw error
    }
  }

  return events
}
