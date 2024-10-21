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
  Plus: "<:plus:1297802422579630231>",
  Minus: "<:minus:1297802433019252786>",
  Play: "<:play:1297802467551215667>",
  Pause: "<:pause:1297802457392480297>",
  Stop: "<:stop:1297802542951956562>",
  Shuffle: "<:shuffle:1297802481484697623>",
  Repeat: "<:repeat:1297802492750463036>",
  NextTrack: "<:next_track:1297802528142004235>",
  PreviousTrack: "<:previous_track:1297802516146421854>",
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
  Plus: "➕",
  Minus: "➖",
  Play: "▶️",
  Pause: "⏸️",
  Stop: "⏹️",
  Shuffle: "🔀",
  Repeat: "🔁",
  NextTrack: "⏭️",
  PreviousTrack: "⏮️",
} satisfies Record<keyof typeof ApplicationEmojis, string>

export const Emojis = {
  ZeroWidthJoiner: "‍",
  GiveawayReaction: "🎉",
  ...(env.NODE_ENV === "production" ? ApplicationEmojis : FallbackEmojis),
}
