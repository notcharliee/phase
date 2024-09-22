import { formatEmoji } from "discord.js"

import { env } from "~/lib/env"

export const ApplicationEmojis = {
  Connect4_Empty: formatEmoji("1287414239098835025"),
  Connect4_Player1: formatEmoji("1287414378412642304"),
  Connect4_Player2: formatEmoji("1287414438680596695"),
}

export const FallbackEmojis = {
  Connect4_Empty: "⬛",
  Connect4_Player1: "⚪",
  Connect4_Player2: "🟣",
} satisfies Record<keyof typeof ApplicationEmojis, string>

export const Emojis = {
  ZeroWidthJoiner: "‍",
  ...(env.NODE_ENV === "production" ? ApplicationEmojis : FallbackEmojis),
}
