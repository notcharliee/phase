import { BotEventContext, BotEventExecute, BotEventName } from "~/types/events"

export class BotEventBuilder<
  TName extends BotEventName,
  TContext extends BotEventContext[TName] | undefined,
> {
  public readonly name!: TName
  public readonly context!: TContext
  public readonly metadata: object
  public readonly listenerType: "on" | "once"
  public readonly execute: BotEventExecute<TName, TContext>

  public constructor() {
    this.metadata = { type: "event" }
    this.listenerType = "on"
    this.execute = () => {}
  }

  public setName<T extends BotEventName>(name: T) {
    Reflect.set(this, "name", name)
    return this as unknown as BotEventBuilder<T, undefined>
  }

  public setContext<T extends BotEventContext[TName]>(context: T) {
    Reflect.set(this, "context", context)
    return this as unknown as BotEventBuilder<TName, T>
  }

  public setMetadata(metadata: object) {
    Reflect.set(this, "metadata", { type: "event", ...metadata })
    return this
  }

  public setListenerType(listenerType: "on" | "once") {
    Reflect.set(this, "listenerType", listenerType)
    return this
  }

  /**
   * @deprecated Use `setListenerType` instead.
   */
  public setOnce(value: boolean) {
    Reflect.set(this, "listenerType", value ? "once" : "on")
    return this
  }

  public setExecute(execute: BotEventExecute<TName, TContext>) {
    Reflect.set(this, "execute", execute)
    return this
  }
}
