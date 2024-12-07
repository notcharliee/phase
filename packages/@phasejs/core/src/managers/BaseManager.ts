import type { BotClient } from "~/client/BotClient"

export abstract class BaseManager {
  public readonly phase: BotClient

  constructor(phase: BotClient) {
    this.phase = phase
  }
}
