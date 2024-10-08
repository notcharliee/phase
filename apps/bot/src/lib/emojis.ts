import { env } from "~/lib/env"

export const ApplicationEmojis = {
  Connect4Empty: "<:connect4_empty:1287414239098835025>",
  Connect4Player1: "<:connect4_player1:1287414378412642304>",
  Connect4Player2: "<:connect4_player2:1287539813058084914>",
  LockClosed: `<:lock_closed:1293180513816809496>`,
  LockOpen: `<:lock_open:1293180537317494815>`,
  Delete: `<:delete:1293180561598447656>`,
}

export const FallbackEmojis = {
  Connect4Empty: "⬛",
  Connect4Player1: "⚪",
  Connect4Player2: "🟣",
  LockClosed: "🔒",
  LockOpen: "🔓",
  Delete: "🗑️",
} satisfies Record<keyof typeof ApplicationEmojis, string>

export const Emojis = {
  ZeroWidthJoiner: "‍",
  GiveawayReaction: "🎉",
  ...(env.NODE_ENV === "production" ? ApplicationEmojis : FallbackEmojis),
}
