import { drizzle as drizzleHttp } from "drizzle-orm/neon-http"
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres"

import { env } from "~/lib/env"

import { otps } from "~/postgres/schemas/otps"

import type { NeonHttpDatabase } from "drizzle-orm/neon-http"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

export class Database {
  public readonly uri: string
  public readonly drizzle: NeonHttpDatabase | NodePgDatabase

  constructor(http = false) {
    this.uri = env.POSTGRES_URI
    this.drizzle = http ? drizzleHttp(this.uri) : drizzleNode(this.uri)
  }

  static tables = {
    otps,
  }
}
