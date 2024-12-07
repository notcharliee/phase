import type { DjsClient } from "~/types/client"

export abstract class BaseStore {
  _init = false

  /** Populates the store with data. */
  public async init(_client: DjsClient) {
    if (this._init) return this

    this._init = true
    return this
  }
}
