import mongoose from "mongoose"

import { afks } from "./models/afks.js"
import { configs } from "./models/configs.js"
import { giveaways } from "./models/giveaways.js"
import { guilds } from "./models/guilds.js"
import { levels } from "./models/levels.js"
import { otps } from "./models/otps.js"
import { reminders } from "./models/reminders.js"
import { tags } from "./models/tags.js"

interface InitialisedDatabase extends Omit<Database, "init"> {
  afks: typeof afks
  configs: typeof configs
  giveaways: typeof giveaways
  guilds: typeof guilds
  levels: typeof levels
  otps: typeof otps
  reminders: typeof reminders
  tags: typeof tags
}

interface DatabaseConfig {
  /** Automatically create indexes for all models (startup performance may be impacted). */
  autoIndex?: boolean
  /** Cache the database connection in global state (useful for HMR). */
  cacheConnection?: boolean
  /** Enable debug logging. */
  debug?: boolean
}

const globalForDb = globalThis as unknown as {
  mongodbConn: mongoose.Mongoose | undefined
}

export class Database implements Disposable {
  private _autoIndex: boolean = true
  private _cacheConnection: boolean = false
  private _debug: boolean = false

  constructor(config?: DatabaseConfig) {
    if (config?.autoIndex) this._autoIndex = config.autoIndex
    if (config?.cacheConnection) this._cacheConnection = config.cacheConnection
    if (config?.debug) this._debug = config.debug
  }

  async init() {
    this.debug("Initialising database")

    if (!process.env.MONGODB_URI) {
      throw new Error("'MONGODB_URI' environment variable not set")
    }

    if (this._cacheConnection && globalForDb.mongodbConn) {
      this.debug("Reusing existing connection to MongoDB")
    } else {
      this.debug("Connecting to MongoDB")

      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        autoIndex: this._autoIndex,
      })

      this.debug("Connected to MongoDB")

      if (this._cacheConnection) {
        globalForDb.mongodbConn = conn
        this.debug("Cached connection to MongoDB")
      }
    }

    Object.assign(this, {
      afks,
      configs,
      giveaways,
      guilds,
      levels,
      otps,
      reminders,
      tags,
    } satisfies Omit<InitialisedDatabase, typeof Symbol.dispose>)

    return this as unknown as InitialisedDatabase
  }

  private debug(message: string) {
    if (this._debug) console.log(message)
  }

  [Symbol.dispose]() {
    mongoose.disconnect().then(() => this.debug("Disconnected from MongoDB"))
  }
}
