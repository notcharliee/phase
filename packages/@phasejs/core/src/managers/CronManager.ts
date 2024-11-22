import { BaseManager, Collection } from "discord.js"

import type { BotCron } from "~/client/BotCron"
import type { DjsClient } from "~/types/client"
import type { BotCronPattern } from "~/types/crons"

export class CronManager extends BaseManager {
  protected _crons: Collection<BotCronPattern, BotCron[]>

  constructor(client: DjsClient) {
    super(client)
    this._crons = new Collection()

    // if the client is not ready, wait for it to be ready before starting crons
    if (!this.client.isReady()) {
      this.client.once("ready", () => {
        this._crons.forEach((cronArray) => {
          cronArray.forEach((cron) => cron.init())
        })
      })
    }
  }

  /**
   * Adds a cron job to the cron manager.
   */
  public create(cron: BotCron) {
    const cronArray = this._crons.get(cron.pattern) ?? []

    cronArray.push(cron)
    this._crons.set(cron.pattern, cronArray)

    // if the client is already ready, start the cron immediately
    if (this.client.isReady()) cron.init()

    return this
  }

  /**
   * Removes a cron job from the cron manager.
   */
  public delete(cron: BotCron) {
    const cronArray = this._crons.get(cron.pattern)
    if (!cronArray) return false

    const cronIndex = cronArray.findIndex((c) => c === cron)
    if (cronIndex === -1) return false

    cronArray.splice(cronIndex, 1)
    this._crons.set(cron.pattern, cronArray)

    cron.destroy()

    return true
  }

  /**
   * Checks if a cron job exists in the cron manager.
   */
  public has(cron: BotCron) {
    const cronArray = this._crons.get(cron.pattern)
    return cronArray?.includes(cron)
  }

  /**
   * Gets a cron job from the cron manager.
   */
  public get(cron: BotCron) {
    const cronArray = this._crons.get(cron.pattern)
    return cronArray?.find((c) => c === cron)
  }

  /**
   * Destroys all cron jobs in the cron manager.
   */
  public destroy() {
    this._crons.forEach((cronArray, cronPattern) => {
      cronArray.forEach((cron) => cron.destroy())
      this._crons.delete(cronPattern)
    })

    return this
  }
}
