import type { BotEventBuilder } from "~/builders"

export interface EventFile {
  path: string
  event: BotEventBuilder
}
