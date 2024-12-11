import type {
  Base64Resolvable,
  BufferResolvable,
  ImageExtension,
} from "discord.js"

export type BotEmojiId = string
export type BotEmojiName = string
export type BotEmojiType = Exclude<ImageExtension, "webp">
export type BotEmojiData = BufferResolvable | Base64Resolvable

export interface BotEmoji {
  id?: BotEmojiId
  name: BotEmojiName
  type: BotEmojiType
  data: BotEmojiData
}

export type BotEmojiWithId = Required<BotEmoji>

export type BotEmojiString = `<${"a" | ""}:${BotEmojiName}:${BotEmojiId}>`
