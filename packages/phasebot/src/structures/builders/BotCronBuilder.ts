import { Cron } from "croner"

import type { BotCronExecute } from "~/types/crons"
import type { Client } from "discord.js"

export class BotCronBuilder {
  private cron: Cron | undefined = undefined

  /**
   * The cron time to execute on.
   */
  public readonly pattern!: string

  /**
   * The function to execute when the cron job is triggered.
   */
  public readonly execute!: BotCronExecute

  /**
   * The metadata for the cron job.
   */
  public readonly metadata: object = {
    type: "cron",
  }

  /**
   * Set the cron time to execute on.
   *
   * @param name - The cron time to execute on.
   */
  setPattern(pattern: string) {
    Reflect.set(this, "pattern", pattern)
    return this
  }

  /**
   * Set the function to execute when the cron job is triggered.
   *
   * @param fn - The function to execute when the cron job is triggered.
   */
  setExecute(fn: BotCronExecute) {
    Reflect.set(this, "execute", fn)
    return this
  }

  /**
   * Set the metadata for the cron job.
   *
   * @param metadata - The metadata for the cron job.
   */
  setMetadata(metadata: object) {
    Reflect.set(this, "metadata", {
      type: "cron",
      ...metadata,
    })
    return this
  }

  /**
   * Start the cron job.
   *
   * Running this before `.setPattern()` and `.setExecute()` will fail.
   *
   * Any cron jobs found in the `src/crons` directory will be started automatically on bot startup.
   */
  start(client: Client<true>) {
    if (!this.pattern) {
      throw new Error("Pattern not specified.")
    }

    if (!this.execute) {
      throw new Error("Execute not specified.")
    }

    const job = new Cron(this.pattern, () => this.execute(client))

    this.cron = job

    return this
  }

  /**
   * Pause execution.
   */
  pause() {
    if (!this.cron) {
      throw new Error("Cron not started.")
    }

    const success = this.cron.pause()

    if (!success) {
      throw new Error("Cron was already paused.")
    }

    return this
  }

  /**
   * Resume execution.
   */
  resume() {
    if (!this.cron) {
      throw new Error("Cron not started.")
    }

    const success = this.cron.resume()

    if (!success) {
      throw new Error("Cron was not paused.")
    }

    return this
  }

  /**
   * Stop execution.
   *
   * Running this will forcefully stop the job, and prevent furter exection. `.resume()` will not work after stopping.
   */
  stop() {
    if (!this.cron) {
      throw new Error("Cron not started.")
    }

    this.cron.stop()

    return this
  }

  /**
   * Trigger the execute function manually.
   */
  trigger() {
    if (!this.cron) {
      throw new Error("Cron not started.")
    }

    this.cron.trigger()

    return this
  }
}
