import { BaseManager } from "~/managers/BaseManager"

import type { BotClient } from "~/client/BotClient"
import type { BotStores } from "~/types/stores"

export class StoreManager extends BaseManager {
  protected readonly _stores: BotStores

  constructor(phase: BotClient, stores: BotStores = {}) {
    super(phase)
    this._stores = stores

    return new Proxy(this, {
      get(target, prop) {
        if (prop in target._stores && typeof prop === "string") {
          return target._stores[prop]
        }
        return target[prop as keyof typeof target]
      },
    })
  }

  public async init() {
    this.phase.client.stores = this

    for (const store of Object.values(this._stores)) {
      await store.init(this.phase.client)
      void this.phase.emitter.emit("initStore", store)
    }

    return this
  }
}
