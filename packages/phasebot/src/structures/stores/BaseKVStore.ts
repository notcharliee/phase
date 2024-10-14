import { Collection } from "discord.js"

export abstract class BaseKVStore<K = string, V = unknown> extends Collection<
  K,
  V
> {
  _init = false

  /** Populates the store with data. */
  public async init() {
    if (this._init) return this

    this._init = true
    return this
  }
}
