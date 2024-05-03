import { isAsyncFunction } from "node:util/types"

import { ClientEvents, Collection } from "discord.js"

import { BotEventBuilder, BotEventExecute } from "~/builders"

import { EventsCollection, PhaseClient } from "../client"

export const handleEvents = (client: PhaseClient) => {
  const events = Array.from(client.events.values()).flatMap((event) => event)

  // in case this is being reran after the bot is initially started, remove any existing listeners
  if (client.isReady()) client.removeAllListeners()

  for (const event of events) {
    const listenerType = event.once ? "once" : "on"

    const isAsync = isAsyncFunction(event.execute)

    client[listenerType](
      event.name,
      isAsync
        ? async (...args) => await event.execute(client, ...args)
        : (...args) => event.execute(client, ...args),
    )
  }
}

export const getEvents = async () => {
  const paths = Array.from(
    new Bun.Glob("src/events/**/*.{js,ts,jsx,tsx}").scanSync({
      absolute: true,
    }),
  ).filter((path) => !/.*(\\|\/)_.*?.(js|ts|jsx|tsx)/.test(path))

  const events: EventsCollection = new Collection()

  for (const path of paths) {
    const defaultExport = (await import(path).then((m) => m.default)) as unknown

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
      const data = {
        name: defaultExport.name as keyof ClientEvents,
        execute: defaultExport.execute as BotEventExecute<keyof ClientEvents>,
      }

      event = new BotEventBuilder().setName(data.name).setExecute(data.execute)
    }

    if (!event) {
      throw new Error(
        `Event file '${path}' does not export a valid event handler`,
      )
    }

    if (events.has(event.name)) {
      const existingEvent = events.get(event.name)!
      if (Array.isArray(existingEvent)) {
        existingEvent.push(event)
      } else {
        events.set(event.name, [existingEvent, event])
      }
    } else {
      events.set(event.name, event)
    }
  }

  return events
}
