import type { EventFile } from "~/types/events"
import type { Client } from "discord.js"

export const handleEvents = async (
  client: Client<false>,
  eventFiles: EventFile[],
) => {
  for (const { event } of eventFiles) {
    const listenerType = event.once ? "once" : "on"

    client[listenerType](event.name, (...args) =>
      event.execute(client, ...args),
    )
  }
}
