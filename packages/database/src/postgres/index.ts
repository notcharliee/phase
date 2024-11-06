import { ModuleId } from "@repo/utils/modules"
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http"
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres"

import { env } from "~/lib/env"

import * as schema from "~/postgres/schemas"

export class Database {
  public readonly uri
  public readonly http
  public readonly drizzle

  constructor(http = false) {
    this.http = http
    this.uri = env.POSTGRES_URI
    this.drizzle = this.http ? this.initHttpClient() : this.initNodeClient()
  }

  private initHttpClient() {
    return drizzleHttp(this.uri, { schema })
  }

  private initNodeClient() {
    return drizzleNode(this.uri, { schema })
  }

  public async findGuild(guildId: string) {
    return this.drizzle.query.guilds.findFirst({
      where: (guild, { eq }) => eq(guild.id, guildId),
      with: {
        modules: {
          columns: { guildId: false },
          with: Object.values(ModuleId).reduce(
            (acc, id) => ({ ...acc, [id]: true }),
            {} as Record<ModuleId, true>,
          ),
        },
        theme: true,
      },
    })
  }
}
