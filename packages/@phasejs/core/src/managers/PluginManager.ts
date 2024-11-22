import { BaseManager, Collection } from "discord.js"

import type { DjsClient } from "~/types/client"
import type { BotPlugin } from "~/types/plugin"

export class PluginManager extends BaseManager {
  protected readonly _plugins: Collection<string, BotPlugin>

  constructor(client: DjsClient, plugins: BotPlugin[] = []) {
    super(client)
    this._plugins = new Collection(this.mapPlugins(plugins))
  }

  public async init() {
    for (const { onLoad } of this._plugins.values()) {
      await onLoad(this.client as DjsClient<false>)
    }
  }

  private mapPlugins(plugins: BotPlugin[]) {
    return plugins.reduce<[string, BotPlugin][]>((acc, plugin) => {
      acc.push([`${plugin.name}@${plugin.version}`, plugin])
      return acc
    }, [])
  }
}
