import type { Client } from "discord.js"

export abstract class BaseStore {
  _init = false

  /** Populates the store with data. */
  public async init(client: Client) {
    if (this._init) return this

    this._init = true
    return this
  }
}
