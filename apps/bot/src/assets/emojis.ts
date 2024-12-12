import { join } from "node:path"

import connect4EmptyFilePath from "~/assets/emojis/connect4-empty.png" with { type: "file" }
import connect4Player1FilePath from "~/assets/emojis/connect4-player1.png" with { type: "file" }
import connect4Player2FilePath from "~/assets/emojis/connect4-player2.png" with { type: "file" }
import deleteFilePath from "~/assets/emojis/delete.png" with { type: "file" }
import editFilePath from "~/assets/emojis/edit.png" with { type: "file" }
import lockClosedFilePath from "~/assets/emojis/lock-closed.png" with { type: "file" }
import lockOpenFilePath from "~/assets/emojis/lock-open.png" with { type: "file" }
import minusFilePath from "~/assets/emojis/minus.png" with { type: "file" }
import mutedFilePath from "~/assets/emojis/muted.png" with { type: "file" }
import nextTrackFilePath from "~/assets/emojis/next-track.png" with { type: "file" }
import pauseFilePath from "~/assets/emojis/pause.png" with { type: "file" }
import playFilePath from "~/assets/emojis/play.png" with { type: "file" }
import plusFilePath from "~/assets/emojis/plus.png" with { type: "file" }
import previousTrackFilePath from "~/assets/emojis/previous-track.png" with { type: "file" }
import repeatFilePath from "~/assets/emojis/repeat.png" with { type: "file" }
import shuffleFilePath from "~/assets/emojis/shuffle.png" with { type: "file" }
import stopFilePath from "~/assets/emojis/stop.png" with { type: "file" }
import transferFilePath from "~/assets/emojis/transfer.png" with { type: "file" }
import usersFilePath from "~/assets/emojis/users.png" with { type: "file" }

function loadFile(path: string) {
  const absolutePath = path.startsWith(".") ? join(import.meta.dir, path) : path
  return Bun.file(absolutePath)
}

export const connect4EmptyFile = loadFile(connect4EmptyFilePath)
export const connect4Player1File = loadFile(connect4Player1FilePath)
export const connect4Player2File = loadFile(connect4Player2FilePath)
export const deleteFile = loadFile(deleteFilePath)
export const editFile = loadFile(editFilePath)
export const lockClosedFile = loadFile(lockClosedFilePath)
export const lockOpenFile = loadFile(lockOpenFilePath)
export const minusFile = loadFile(minusFilePath)
export const mutedFile = loadFile(mutedFilePath)
export const nextTrackFile = loadFile(nextTrackFilePath)
export const pauseFile = loadFile(pauseFilePath)
export const playFile = loadFile(playFilePath)
export const plusFile = loadFile(plusFilePath)
export const previousTrackFile = loadFile(previousTrackFilePath)
export const repeatFile = loadFile(repeatFilePath)
export const shuffleFile = loadFile(shuffleFilePath)
export const stopFile = loadFile(stopFilePath)
export const transferFile = loadFile(transferFilePath)
export const usersFile = loadFile(usersFilePath)
