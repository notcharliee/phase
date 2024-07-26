import { isAsyncFunction } from "node:util/types"

import { Client, Collection } from "discord.js"

import { BotEventBuilder } from "~/builders"

import type { BotEventExecute } from "~/builders"
import type { ClientEvents } from "discord.js"

export type EventsCollection = Collection<string, BotEventBuilder[]>

export const getEventPaths = () => {
  return Array.from(
    new Bun.Glob("src/events/**/*.{js,ts,jsx,tsx}").scanSync({
      absolute: true,
    }),
  )
}

export const handleEvents = async (
  client: Client<false>,
  events?: EventsCollection,
) => {
  // if no events collection is provided, load all event files
  if (!events) {
    const paths = getEventPaths()

    events = new Collection()

    for (const path of paths) {
      const defaultExport = (await import(path).then(
        (m) => m.default,
      )) as unknown

      if (!defaultExport) {
        throw new Error(`Event file '${path}' is missing a default export`)
      }

      let event: BotEventBuilder | undefined

      if (
        typeof defaultExport === "object" &&
        "metadata" in defaultExport &&
        defaultExport.metadata &&
        typeof defaultExport.metadata === "object" &&
        "type" in defaultExport.metadata &&
        defaultExport.metadata.type === "event"
      ) {
        event = defaultExport as BotEventBuilder
      } else if (
        typeof defaultExport === "object" &&
        "name" in defaultExport &&
        typeof defaultExport.name === "string" &&
        "execute" in defaultExport &&
        typeof defaultExport.execute === "function"
      ) {
        event = new BotEventBuilder()
          .setName(defaultExport.name as keyof ClientEvents)
          .setExecute(defaultExport.execute as BotEventExecute)
      }

      if (!event) {
        throw new Error(
          `Event file '${path}' does not export a valid event handler`,
        )
      }

      events.set(event.name, [...(events.get(event.name) ?? []), event])
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
