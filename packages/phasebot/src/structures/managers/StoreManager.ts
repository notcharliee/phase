import { BaseManager } from "discord.js"

import type { BaseStore } from "~/structures"
import type { Stores } from "~/types/stores"
import type { Client } from "discord.js"

/** Manages all of the stores used in the bot. */
export class StoreManager extends BaseManager {
  protected readonly _stores: Stores

  constructor(client: Client, stores: Stores) {
    super(client)

    this._stores = stores

    return new Proxy(this, {
      get(target, prop) {
        if (prop in target._stores && typeof prop === "string") {
          return target._stores[prop as keyof Stores]
        }
        return target[prop as keyof typeof target]
      },
    })
  }

  public async init() {
    for (const key of Object.keys(this._stores)) {
      await (this._stores[key as keyof Stores] as BaseStore).init()
    }

    return this
  }
}
