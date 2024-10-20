import { env } from "~/lib/env"

export const ApplicationEmojis = {
  Connect4Empty: "<:connect4_empty:1287414239098835025>",
  Connect4Player1: "<:connect4_player1:1287414378412642304>",
  Connect4Player2: "<:connect4_player2:1287539813058084914>",
  LockClosed: `<:lock_closed:1293180513816809496>`,
  LockOpen: `<:lock_open:1293180537317494815>`,
  Delete: `<:delete:1293180561598447656>`,
  PencilEdit: `<:pencil_edit:1293297875601588405>`,
  MicrophoneOff: `<:microphone_off:1293297932774150214>`,
  Users: `<:users:1293297987375595590>`,
  Transfer: `<:transfer:1293549888679710771>`,
}

export const FallbackEmojis = {
  Connect4Empty: "⬛",
  Connect4Player1: "⚪",
  Connect4Player2: "🟣",
  LockClosed: "🔒",
  LockOpen: "🔓",
  Delete: "🗑️",
  PencilEdit: "📝",
  MicrophoneOff: "🎙️",
  Users: "👥",
  Transfer: "➡️",
} satisfies Record<keyof typeof ApplicationEmojis, string>

export const Emojis = {
  ZeroWidthJoiner: "‍",
  GiveawayReaction: "🎉",
  Add: "➕",
  Remove: "➖",
  Pause: "⏸️",
  Resume: "▶️",
  Stop: "⏹️",
  Skip: "⏭️",
  Previous: "⏮️",
  Repeat: "🔁",
  Shuffle: "🔀",
  ...(env.NODE_ENV === "production" ? ApplicationEmojis : FallbackEmojis),
}
