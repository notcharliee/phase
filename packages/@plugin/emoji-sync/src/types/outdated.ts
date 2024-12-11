import type { BotEmoji, BotEmojiWithId } from "~/types/emojis"

export interface OutdatedBotEmojis {
  create: BotEmoji[]
  delete: BotEmojiWithId[]
  update: BotEmojiWithId[]
}
