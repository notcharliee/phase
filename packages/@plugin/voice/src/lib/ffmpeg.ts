import ffmpegPath from "ffmpeg-static"
import ffmpeg from "fluent-ffmpeg"

ffmpeg.setFfmpegPath(ffmpegPath!)

export { ffmpeg }