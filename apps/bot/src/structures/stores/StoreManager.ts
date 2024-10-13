import { BaseManager } from "discord.js"

import { ConfigStore } from "~/structures/stores/ConfigStore"
import { GuildStore } from "~/structures/stores/GuildStore"
import { TwitchStatusStore } from "~/structures/stores/TwitchStatusStore"

import type { Client } from "discord.js"

/** Holds all the stores used in the bot. */
export class StoreManager extends BaseManager {
  public readonly config = new ConfigStore()
  public readonly guilds = new GuildStore()
  public readonly twitchStatuses = new TwitchStatusStore()

  constructor(client: Client) {
    super(client)
  }

  public async init() {
    await this.config.init()
    await this.guilds.init()
    await this.twitchStatuses.init()

    return this
  }
}
