import { env } from "~/lib/env"

export const ApplicationEmojis = {
  Connect4_Empty: "<:connect4_empty:1287414239098835025>",
  Connect4_Player1: "<:connect4_player1:1287414378412642304>",
  Connect4_Player2: "<:connect4_player2:1287539813058084914>",
  Lock_Closed: `<:lock_closed:1293180513816809496>`,
  Lock_Open: `<:lock_open:1293180537317494815>`,
  Delete: `<:delete:1293180561598447656>`,
}

export const FallbackEmojis = {
  Connect4_Empty: "⬛",
  Connect4_Player1: "⚪",
  Connect4_Player2: "🟣",
  Lock_Closed: "🔒",
  Lock_Open: "🔓",
  Delete: "🗑️",
} satisfies Record<keyof typeof ApplicationEmojis, string>

export const Emojis = {
  ZeroWidthJoiner: "‍",
  Giveaway_Reaction: "🎉",
  ...(env.NODE_ENV === "production" ? ApplicationEmojis : FallbackEmojis),
}
