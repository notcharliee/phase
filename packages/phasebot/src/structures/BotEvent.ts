import type {
  BotEventContextMap,
  BotEventExecute,
  BotEventExecuteArgs,
  BotEventListenerType,
  BotEventMetadata,
  BotEventName,
} from "~/types/events"
import type { Client } from "discord.js"

export class BotEvent<
  TName extends BotEventName = BotEventName,
  TContext extends BotEventContextMap[TName] = BotEventContextMap[TName],
> {
  protected _init: boolean = false
  protected _client: Client

  public readonly name: TName
  public readonly context: TContext | undefined
  public readonly listenerType: BotEventListenerType
  public readonly metadata: BotEventMetadata
  public readonly execute: BotEventExecute<TName, TContext>

  constructor(
    client: Client,
    params: {
      name: TName
      context: TContext | undefined
      listenerType: BotEventListenerType
      metadata: BotEventMetadata
      execute: BotEventExecute<TName, TContext>
    },
  ) {
    this._client = client

    this.name = params.name
    this.context = params.context
    this.listenerType = params.listenerType
    this.metadata = params.metadata
    this.execute = params.execute
  }

  /**
   * Initialises the event listener.
   *
   * @throws If the event is already initialised.
   */
  public init() {
    if (this._init) {
      throw new Error("Event has already been initialised.")
    }

    this._client[this.listenerType](this.name, async (...args) => {
      const executeArgs = args as BotEventExecuteArgs<TName, TContext>

      try {
        await this.execute(this._client, ...executeArgs)
      } catch (error) {
        console.error(`Error occurred in '${this.name}' event:`)
        console.error(error)
      } finally {
        if (this.listenerType === "once") {
          this.destroy()
        }
      }
    })

    this._init = true
    return this
  }

  /**
   * Destroys the event listener.
   */
  public destroy() {
    this._client.removeListener(this.name, this.execute)
    this._init = false
    return this
  }
}
