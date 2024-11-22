import { BaseManager, Collection } from "discord.js"

import type { BotEvent } from "~/client/BotEvent"
import type { DjsClient } from "~/types/client"
import type { BotEventName } from "~/types/events"

export class EventManager extends BaseManager {
  protected _events: Collection<BotEventName, BotEvent[]>

  constructor(client: DjsClient) {
    super(client)
    this._events = new Collection()
  }

  /**
   * Adds an event to the event manager.
   */
  public create(event: BotEvent) {
    const eventArray = this._events.get(event.name) ?? []

    eventArray.push(event)
    this._events.set(event.name, eventArray)

    event.init()

    return this
  }

  /**
   * Removes an event from the event manager.
   */
  public delete(event: BotEvent) {
    const eventArray = this._events.get(event.name)
    if (!eventArray) return false

    const eventIndex = eventArray.findIndex((e) => e === event)
    if (eventIndex === -1) return false

    eventArray.splice(eventIndex, 1)
    this._events.set(event.name, eventArray)

    event.destroy()

    return true
  }

  /**
   * Checks if an event exists in the event manager.
   */
  public has(event: BotEvent) {
    const eventArray = this._events.get(event.name)
    return eventArray?.includes(event)
  }

  /**
   * Gets an event from the event manager.
   */
  public get(event: BotEvent) {
    const eventArray = this._events.get(event.name)
    return eventArray?.find((e) => e === event)
  }

  /**
   * Destroys all event listeners in the event manager.
   */
  public destroy() {
    this._events.forEach((eventArray, eventName) => {
      eventArray.forEach((event) => event.destroy())
      this._events.delete(eventName)
    })

    return this
  }
}
