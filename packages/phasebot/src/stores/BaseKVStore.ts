import { Collection } from "discord.js"

import type { DjsClient } from "~/types/client"

export abstract class BaseKVStore<K = string, V = unknown> extends Collection<
  K,
  V
> {
  _init = false

  /** Populates the store with data. */
  public async init(_client: DjsClient) {
    if (this._init) return this

    this._init = true
    return this
  }
}
