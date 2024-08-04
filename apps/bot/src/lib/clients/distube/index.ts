import { getClient } from "phasebot"

import { YouTubePlugin } from "@distube/youtube"
import { DisTube, Events } from "distube"
import ffmpegPath from "ffmpeg-static"

import { getCookies } from "./cookies"

const globalForDistubeClient = globalThis as unknown as {
  distubeClient: DisTube | undefined
}

export const distubeClient =
  globalForDistubeClient.distubeClient ??
  new DisTube(getClient(), {
    plugins: [new YouTubePlugin({ cookies: await getCookies() })],
    ffmpeg: { path: ffmpegPath! },
    emitAddListWhenCreatingQueue: false,
    emitAddSongWhenCreatingQueue: false,
    emitNewSongOnly: false,
    savePreviousSongs: false,
    nsfw: false,
  })

distubeClient.on(Events.FINISH, (queue) => queue.stop())
distubeClient.on(Events.DISCONNECT, (queue) => queue.stop())
distubeClient.on(Events.DELETE_QUEUE, (queue) => queue.voice.leave())
distubeClient.on(Events.ERROR, (error) => console.error(error))

export { getCookies }
