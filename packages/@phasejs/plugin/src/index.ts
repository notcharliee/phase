import type { Client } from "discord.js"

export type Awaitable<T> = T | Promise<T>

export interface BotPlugin {
  name: string
  version: `${number}.${number}.${number}`
  onLoad: (client: Client<false>) => Awaitable<void>
}

export class BotPluginBuilder {
  public readonly name!: BotPlugin["name"]
  public readonly version!: BotPlugin["version"]
  public readonly onLoad!: BotPlugin["onLoad"]

  setName(name: BotPlugin["name"]) {
    Reflect.set(this, "name", name)
    return this
  }

  setVersion(version: BotPlugin["version"]) {
    Reflect.set(this, "version", version)
    return this
  }

  setOnLoad(onLoad: BotPlugin["onLoad"]) {
    Reflect.set(this, "onLoad", onLoad)
    return this
  }

  build(): BotPlugin {
    if (!this.name || !this.version || !this.onLoad) {
      throw new Error("Plugin is missing required properties")
    }

    return {
      name: this.name,
      version: this.version,
      onLoad: this.onLoad,
    }
  }

  /** @deprecated Use `build` instead */
  toJSON(): BotPlugin {
    return this.build()
  }
}
