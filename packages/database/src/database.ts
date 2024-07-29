import mongoose from "mongoose"

import { afks } from "./models/afks.js"
import { giveaways } from "./models/giveaways.js"
import { guilds } from "./models/guilds.js"
import { levels } from "./models/levels.js"
import { otps } from "./models/otps.js"
import { reminders } from "./models/reminders.js"
import { tags } from "./models/tags.js"

interface InitialisedDatabase extends Omit<Database, "init"> {
  afks: typeof afks
  giveaways: typeof giveaways
  guilds: typeof guilds
  levels: typeof levels
  otps: typeof otps
  reminders: typeof reminders
  tags: typeof tags
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

export class Database implements Disposable {
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
      afks,
      giveaways,
      guilds,
      levels,
      otps,
      reminders,
      tags,
    })

    return this as unknown as InitialisedDatabase
  }

  [Symbol.dispose]() {
    mongoose.disconnect()
    if (this._debug) console.log("Disconnected from MongoDB")
  }
}
