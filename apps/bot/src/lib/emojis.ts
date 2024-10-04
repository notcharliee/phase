import { formatEmoji } from "discord.js"

import { env } from "~/lib/env"

export const ApplicationEmojis = {
  Connect4_Empty: formatEmoji("1287414239098835025"),
  Connect4_Player1: formatEmoji("1287414378412642304"),
  Connect4_Player2: formatEmoji("1287539813058084914"),
  Ticket_Locked: formatEmoji("1291406900977729598"),
  Ticket_Unlocked: formatEmoji("1291406915682832515"),
  Ticket_Delete: formatEmoji("1291416942485438555"),
}

export const FallbackEmojis = {
  Connect4_Empty: "⬛",
  Connect4_Player1: "⚪",
  Connect4_Player2: "🟣",
  Ticket_Locked: "🔒",
  Ticket_Unlocked: "🔓",
  Ticket_Delete: "🗑️",
} satisfies Record<keyof typeof ApplicationEmojis, string>

export const Emojis = {
  ZeroWidthJoiner: "‍",
  ...(env.NODE_ENV === "production" ? ApplicationEmojis : FallbackEmojis),
}
