import { Cron } from "croner"

import type {
  BotCronExecute,
  BotCronMetadata,
  BotCronPattern,
} from "~/types/crons"
import type { Client } from "discord.js"

export class BotCron {
  protected _init: boolean = false
  protected _client: Client
  protected _cron: Cron | undefined

  public readonly pattern: BotCronPattern
  public readonly metadata: BotCronMetadata
  public readonly execute: BotCronExecute

  constructor(
    client: Client,
    params: {
      pattern: BotCronPattern
      metadata: BotCronMetadata
      execute: BotCronExecute
    },
  ) {
    this._client = client

    this.pattern = params.pattern
    this.metadata = params.metadata
    this.execute = params.execute
  }

  /**
   * Initialises the cron job.
   *
   * @throws If the cron is already initialised.
   */
  public init() {
    if (this._init) {
      throw new Error("Cron has already been initialised.")
    }

    this._cron = new Cron(this.pattern, async () => {
      try {
        if (!this._client.isReady()) {
          throw new Error("Client is not ready.")
        }

        await this.execute(this._client)
      } catch (error) {
        console.error(`Error occurred in '${this.pattern}' cron:`)
        console.error(error)
      }
    })

    this._init = true
    return this
  }

  /**
   * Destroys the cron job.
   */
  public destroy() {
    this._cron?.stop()
    this._cron = undefined
    this._init = false
    return this
  }
}
