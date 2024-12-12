import { EmojiSync } from "@plugin/emoji-sync"

import {
  connect4EmptyFile,
  connect4Player1File,
  connect4Player2File,
  deleteFile,
  editFile,
  lockClosedFile,
  lockOpenFile,
  minusFile,
  mutedFile,
  nextTrackFile,
  pauseFile,
  playFile,
  plusFile,
  previousTrackFile,
  repeatFile,
  shuffleFile,
  stopFile,
  transferFile,
  usersFile,
} from "~/assets/emojis"

import type { BotEmoji, BotEmojiType } from "@plugin/emoji-sync"
import type { BunFile } from "bun"

export const emojiSync = new EmojiSync(async () => {
  const defineEmoji = async <TName extends string>(
    name: TName,
    file: BunFile,
  ) => ({
    name,
    type: file.type.replace("image/", "") as BotEmojiType,
    data: Buffer.from(await file.arrayBuffer()),
  })

  return {
    connect4Empty: await defineEmoji("connect4_empty", connect4EmptyFile),
    connect4Player1: await defineEmoji("connect4_player1", connect4Player1File),
    connect4Player2: await defineEmoji("connect4_player2", connect4Player2File),
    lockClosed: await defineEmoji("lock_closed", lockClosedFile),
    lockOpen: await defineEmoji("lock_open", lockOpenFile),
    delete: await defineEmoji("delete", deleteFile),
    edit: await defineEmoji("edit", editFile),
    minus: await defineEmoji("minus", minusFile),
    muted: await defineEmoji("muted", mutedFile),
    nextTrack: await defineEmoji("next_track", nextTrackFile),
    pause: await defineEmoji("pause", pauseFile),
    play: await defineEmoji("play", playFile),
    plus: await defineEmoji("plus", plusFile),
    previousTrack: await defineEmoji("previous_track", previousTrackFile),
    repeat: await defineEmoji("repeat", repeatFile),
    shuffle: await defineEmoji("shuffle", shuffleFile),
    stop: await defineEmoji("stop", stopFile),
    transfer: await defineEmoji("transfer", transferFile),
    users: await defineEmoji("users", usersFile),
  } as const satisfies Record<string, BotEmoji>
})

export const emojiSyncPlugin = emojiSync.plugin.bind(emojiSync)

export const Emojis = {
  ZeroWidthJoiner: "‍",
  GiveawayReaction: "🎉",
  Connect4Empty: emojiSync.emojis.connect4Empty,
  Connect4Player1: emojiSync.emojis.connect4Player1,
  Connect4Player2: emojiSync.emojis.connect4Player2,
  LockClosed: emojiSync.emojis.lockClosed,
  LockOpen: emojiSync.emojis.lockOpen,
  Delete: emojiSync.emojis.delete,
  Edit: emojiSync.emojis.edit,
  Minus: emojiSync.emojis.minus,
  Muted: emojiSync.emojis.muted,
  NextTrack: emojiSync.emojis.nextTrack,
  Pause: emojiSync.emojis.pause,
  Play: emojiSync.emojis.play,
  Plus: emojiSync.emojis.plus,
  PreviousTrack: emojiSync.emojis.previousTrack,
  Repeat: emojiSync.emojis.repeat,
  Shuffle: emojiSync.emojis.shuffle,
  Stop: emojiSync.emojis.stop,
  Transfer: emojiSync.emojis.transfer,
  Users: emojiSync.emojis.users,
}
