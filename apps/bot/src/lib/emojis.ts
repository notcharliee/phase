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
  // unchanging values //

  ZeroWidthJoiner: "‍",
  GiveawayReaction: "🎉",

  // getters for emoji sync //

  get Connect4Empty() {
    return emojiSync.emojis.connect4Empty
  },
  get Connect4Player1() {
    return emojiSync.emojis.connect4Player1
  },
  get Connect4Player2() {
    return emojiSync.emojis.connect4Player2
  },
  get LockClosed() {
    return emojiSync.emojis.lockClosed
  },
  get LockOpen() {
    return emojiSync.emojis.lockOpen
  },
  get Delete() {
    return emojiSync.emojis.delete
  },
  get Edit() {
    return emojiSync.emojis.edit
  },
  get Minus() {
    return emojiSync.emojis.minus
  },
  get Muted() {
    return emojiSync.emojis.muted
  },
  get NextTrack() {
    return emojiSync.emojis.nextTrack
  },
  get Pause() {
    return emojiSync.emojis.pause
  },
  get Play() {
    return emojiSync.emojis.play
  },
  get Plus() {
    return emojiSync.emojis.plus
  },
  get PreviousTrack() {
    return emojiSync.emojis.previousTrack
  },
  get Repeat() {
    return emojiSync.emojis.repeat
  },
  get Shuffle() {
    return emojiSync.emojis.shuffle
  },
  get Stop() {
    return emojiSync.emojis.stop
  },
  get Transfer() {
    return emojiSync.emojis.transfer
  },
  get Users() {
    return emojiSync.emojis.users
  },
}
