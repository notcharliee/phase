import mongoose from "mongoose"

import { AFKs } from "./models/afks.js"
import { Giveaways } from "./models/giveaways.js"
import { Guilds } from "./models/guilds.js"
import { Levels } from "./models/levels.js"
import { Otps } from "./models/otps.js"
import { Reminders } from "./models/reminders.js"
import { Tags } from "./models/tags.js"

interface InitialisedDatabase extends Omit<Database, "init"> {
  AFKs: typeof AFKs
  Giveaways: typeof Giveaways
  Guilds: typeof Guilds
  Levels: typeof Levels
  Otps: typeof Otps
  Reminders: typeof Reminders
  Tags: typeof Tags
}

interface DatabaseConfig {
  /** Enable debug logging. */
  debug: boolean
  /** Cache the database connection in development. */
  cacheConnection: boolean
}

/**
 * Cache the database connection in development.
 * This avoids creating a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
  conn: mongoose.Mongoose | undefined
}

export class Database {
  private _debug: boolean
  private _conn: mongoose.Mongoose | null = null

  constructor(config: DatabaseConfig) {
    this._debug = config.debug

    if (config.cacheConnection) {
      this._conn = globalForDb.conn ?? null
    }
  }

  async init() {
    if (this._debug) console.log("Initialising database")

    if (process.env.MONGODB_URI) {
      if (this._conn && process.env.NODE_ENV !== "production") {
        if (this._debug) console.log("Reusing existing connection to MongoDB")
      } else {
        if (this._debug) console.log("Connecting to MongoDB")

        const conn = await mongoose.connect(process.env.MONGODB_URI)
        this._conn = conn
        globalForDb.conn = conn

        if (this._debug) console.log("Connected to MongoDB")
      }
    } else {
      throw new Error("'MONGODB_URI' environment variable not set")
    }

    Object.assign(this, {
      AFKs,
      Giveaways,
      Guilds,
      Levels,
      Otps,
      Reminders,
      Tags,
    })

    return this as unknown as InitialisedDatabase
  }

  async [Symbol.asyncDispose]() {
    await mongoose.disconnect()
    if (this._debug) console.log("Disconnected from MongoDB")
  }
}
