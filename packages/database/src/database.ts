import mongoose from "mongoose"

import { afks } from "~/models/afks"
import { configs } from "~/models/configs"
import { giveaways } from "~/models/giveaways"
import { guilds } from "~/models/guilds"
import { levels } from "~/models/levels"
import { otps } from "~/models/otps"
import { reminders } from "~/models/reminders"
import { tags } from "~/models/tags"

class DatabaseModels {
  readonly afks = afks
  readonly configs = configs
  readonly giveaways = giveaways
  readonly guilds = guilds
  readonly levels = levels
  readonly otps = otps
  readonly reminders = reminders
  readonly tags = tags

  constructor() {
    return new Proxy(this, {
      get: (target, prop) => {
        const isConnected = mongoose.connection.readyState === 1
        const isModel = prop in target

        if (!isConnected && isModel) {
          throw new Error("Database not connected")
        }

        return target[prop as keyof typeof target]
      },
    })
  }
}

interface DatabaseConfig {
  autoIndex?: boolean
  debug?: boolean
}

export class Database extends DatabaseModels implements Disposable {
  #options: DatabaseConfig

  constructor(config?: DatabaseConfig) {
    super()
    this.#options = config ?? {}
  }

  async connect(uri: string) {
    this.#debug("Initialising database")

    if (mongoose.connection.readyState === 1) {
      this.#debug("Reusing existing connection to MongoDB")
    } else {
      this.#debug("Connecting to MongoDB")

      try {
        await mongoose.connect(uri, { autoIndex: this.#options.autoIndex })
        this.#debug("Connected to MongoDB")
      } catch (error) {
        this.#debug(`Failed to connect to MongoDB: ${error}`)
        throw error
      }
    }

    return this
  }

  async disconnect() {
    try {
      await mongoose.disconnect()
      this.#debug("Disconnected from MongoDB")
    } catch (error) {
      this.#debug(`Failed to disconnect from MongoDB: ${error}`)
      throw error
    }

    return this
  }

  #debug(message: string) {
    if (!this.#options.debug) return
    console.debug(message)
  }

  [Symbol.dispose]() {
    this.disconnect()
  }
}
