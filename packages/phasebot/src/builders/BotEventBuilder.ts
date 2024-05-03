import type { ClientEvents } from "discord.js"

import { PhaseClient } from "~/cli/client"
import { PromiseUnion } from "~/types"

export type BotEventExecute<T extends keyof ClientEvents = keyof ClientEvents> =
  (client: PhaseClient, ...args: ClientEvents[T]) => PromiseUnion<any>

export class BotEventBuilder<
  T extends keyof ClientEvents = keyof ClientEvents,
> {
  /**
   * The name of the event.
   */
  public readonly name!: T

  /**
   * The type of listener to attach to the event.
   */
  public readonly once: boolean = false

  /**
   * The function to execute when the event is triggered.
   */
  public readonly execute!: BotEventExecute<T>

  /**
   * The metadata for the event.
   */
  public readonly metadata: object = {
    type: "event",
  }

  /**
   * Set the event name to listen for.
   *
   * @param name - The name of the event.
   */
  setName<Name extends T>(name: Name) {
    Reflect.set(this, "name", name)
    return this as unknown as BotEventBuilder<Name>
  }

  /**
   * Set the type of listener to attach to the event.
   *
   * @param name - The type of listener to attach to the event.
   */
  setOnce(once: boolean) {
    Reflect.set(this, "once", once)
    return this
  }

  /**
   * Set the function to execute when the event is triggered.
   *
   * @param fn - The function to execute when the event is triggered.
   */
  setExecute(fn: BotEventExecute<T>) {
    Reflect.set(this, "execute", fn)
    return this
  }

  /**
   * Set the metadata for the event.
   *
   * @param metadata - The metadata for the event.
   */
  setMetadata(metadata: object) {
    Reflect.set(this, "metadata", {
      type: "event",
      ...metadata,
    })
    return this
  }
}
