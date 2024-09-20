import { BaseManager } from "discord.js"

import type { EventFile } from "~/types/events"
import type { Client } from "discord.js"

export class EventManager extends BaseManager {
  constructor(client: Client, eventFiles: EventFile[]) {
    super(client)

    for (const { event } of eventFiles) {
      const listenerType = event.once ? "once" : "on"

      client[listenerType](event.name, (...args) =>
        event.execute(client, ...args),
      )
    }
  }
}
