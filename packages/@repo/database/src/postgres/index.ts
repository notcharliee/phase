import { drizzle } from "drizzle-orm/node-postgres"

import { env } from "~/lib/env"

import * as schemas from "~/postgres/schemas"

export class Database {
  public readonly uri
  public readonly drizzle

  constructor() {
    this.uri = env.POSTGRES_URI
    this.drizzle = this.init()
  }

  private init() {
    return drizzle({
      connection: this.uri,
      schema: schemas,
      casing: "snake_case",
    })
  }
}
