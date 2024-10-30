import { z } from "zod"

import { BotEvent } from "~/structures"

import type { BotEventContextMap, BotEventName } from "~/types/events"
import type { Client } from "discord.js"

export class BotEventBuilder<
  TName extends BotEventName = BotEventName,
  TContext extends BotEventContextMap[TName] = BotEventContextMap[TName],
> {
  private name: BotEvent<TName, TContext>["name"]
  private context: BotEvent<TName, TContext>["context"]
  private listenerType: BotEvent<TName, TContext>["listenerType"]
  private metadata: BotEvent<TName, TContext>["metadata"]
  private execute: BotEvent<TName, TContext>["execute"]

  constructor() {
    this.name = undefined as never
    this.context = undefined
    this.listenerType = "on"
    this.metadata = { type: "event" }
    this.execute = () => {}
  }

  /**
   * Sets the name of the event.
   */
  public setName<T extends BotEventName>(name: T) {
    this.name = name as unknown as TName
    return this as unknown as BotEventBuilder<T, BotEventContextMap[T]>
  }

  /**
   * Sets the context of the event.
   */
  public setContext<T extends BotEventContextMap[TName]>(
    context: T | undefined,
  ) {
    this.context = context as unknown as TContext
    return this as unknown as BotEventBuilder<TName, T>
  }

  /**
   * Sets the listener type of the event.
   */
  public setListenerType(
    listenerType: BotEvent<TName, TContext>["listenerType"],
  ) {
    this.listenerType = listenerType
    return this
  }

  /**
   * Sets the metadata for the event.
   */
  public setMetadata(
    metadata: Omit<BotEvent<TName, TContext>["metadata"], "type">,
  ) {
    this.metadata = { type: "event", ...metadata }
    return this
  }

  /**
   * Sets the function to execute when the event is triggered.
   */
  public setExecute(execute: BotEvent<TName, TContext>["execute"]) {
    this.execute = execute
    return this
  }

  /**
   * Builds the event.
   */
  public build(client: Client) {
    if (!this.name) throw new Error("Name not specified.")

    return new BotEvent(client, {
      name: this.name,
      context: this.context,
      listenerType: this.listenerType ?? "on",
      metadata: this.metadata ?? { type: "event" },
      execute: this.execute,
    })
  }

  /**
   * Creates an event builder from an event.
   */
  static from(event: BotEvent) {
    const builder = new BotEventBuilder()

    builder.setName(event.name)
    builder.setContext(event.context)
    builder.setListenerType(event.listenerType)
    builder.setMetadata(event.metadata)
    builder.setExecute(event.execute)

    return builder
  }

  /**
   * Checks if something is an event builder.
   */
  static isBuilder(thing: unknown): thing is BotEventBuilder {
    const schema = z
      .object({
        setName: z.function(),
        setContext: z.function(),
        setListenerType: z.function(),
        setMetadata: z.function(),
        setExecute: z.function(),
      })
      .passthrough()

    return schema.safeParse(thing).success
  }
}
