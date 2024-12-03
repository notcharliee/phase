import { BaseManager, Collection } from "discord.js"

import { Theme } from "~/structures/Theme"

import type { ThemeId, ThemeResolvable } from "~/types/theme"
import type { Client, Snowflake } from "discord.js"

export class ThemeManager extends BaseManager {
  public readonly themes: Collection<ThemeId, Theme>
  public readonly guilds: Collection<Snowflake, ThemeId>

  constructor(
    client: Client,
    params: {
      themes: Theme[]
      guilds: Iterable<[Snowflake, ThemeId]>
    },
  ) {
    super(client)
    this.themes = new Collection(params.themes.map((t) => [t.id, t]))
    this.guilds = new Collection(params.guilds)
  }

  public resolve(resolvable: ThemeResolvable) {
    if (Theme.isTheme(resolvable)) {
      return resolvable
    } else if (Theme.isThemeId(resolvable)) {
      return this.themes.get(resolvable)
    } else {
      const guild = this.client.guilds.resolve(resolvable)
      if (!guild) return undefined
      const themeId = this.guilds.get(guild.id)
      if (!themeId) return undefined
      return this.themes.get(themeId)
    }
  }
}
