import { BaseManager, Collection } from "discord.js"

import { BotPluginBuilder } from "~/builders/structures/BotPluginBuilder"
import { DjsClient } from "~/types/client"

import type { BotPlugin, BotPluginResolvable } from "~/types/plugin"

export class PluginManager extends BaseManager {
  protected readonly _plugins: Collection<string, BotPlugin>

  constructor(client: DjsClient, plugins: BotPluginResolvable[] = []) {
    super(client)
    this._plugins = new Collection(this.mapPlugins(plugins))
  }

  public async init() {
    for (const { onLoad } of this._plugins.values()) {
      await onLoad(this.client as DjsClient<false>)
    }
  }

  private mapPlugins(plugins: BotPluginResolvable[]) {
    return plugins.reduce<[string, BotPlugin][]>((acc, plugin) => {
      if (plugin instanceof BotPluginBuilder) plugin = plugin.toJSON()
      acc.push([`${plugin.name}@${plugin.version}`, plugin])
      return acc
    }, [])
  }
}
