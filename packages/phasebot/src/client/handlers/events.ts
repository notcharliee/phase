import { readdirSync, statSync } from "node:fs"
import { extname, join } from "node:path"
import { isAsyncFunction } from "node:util/types"

import { Client, Collection } from "discord.js"

import { BotEventBuilder } from "~/builders"

export type EventsCollection = Collection<string, BotEventBuilder[]>

interface EventFile {
  path: string
  event: BotEventBuilder
}

export const getEventFiles = async () => {
  const eventFiles: EventFile[] = []

  const processDir = async (currentDir: string) => {
    const entries = readdirSync(currentDir)

    for (const entry of entries) {
      if (entry.startsWith("_")) continue

      const path = join(currentDir, entry)
      const stats = statSync(path)

      if (stats.isDirectory()) {
        await processDir(path)
      } else if ([".ts", ".tsx", ".js", ".jsx"].includes(extname(entry))) {
        const file = await import(join(process.cwd(), path))
        const defaultExport = file.default as unknown

        if (!defaultExport) {
          throw new Error(`Event file '${path}' is missing a default export`)
        } else if (
          !(
            typeof defaultExport === "object" &&
            "metadata" in defaultExport &&
            defaultExport.metadata &&
            typeof defaultExport.metadata === "object" &&
            "type" in defaultExport.metadata &&
            defaultExport.metadata.type === "event"
          )
        ) {
          throw new Error(
            `Event file '${path}' does not export a valid event builder`,
          )
        }

        const event = defaultExport as BotEventBuilder

        eventFiles.push({ path, event })
      }
    }
  }

  await processDir("src/events")

  return eventFiles
}

export const handleEvents = async (
  client: Client<false>,
  events?: EventsCollection,
) => {
  if (!events) {
    const eventFiles = await getEventFiles()

    events = new Collection()

    for (const file of eventFiles) {
      events.set(file.event.name, [
        ...(events.get(file.event.name) ?? []),
        file.event,
      ])
    }
  }

  // add all events to the client
  for (const event of Array.from(events.values()).flat()) {
    const listenerType = event.once ? "once" : "on"
    const executeIsAsync = isAsyncFunction(event.execute)

    client[listenerType](
      event.name,
      executeIsAsync
        ? async (...args) => await event.execute(client, ...args)
        : (...args) => event.execute(client, ...args),
    )
  }
}
