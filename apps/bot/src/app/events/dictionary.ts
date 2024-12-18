import { PassThrough } from "node:stream"

import { BotEventBuilder } from "@phasejs/builders"
import { MessageFlags, Routes } from "discord.js"

import ffmpegPath from "ffmpeg-static"
import ffmpeg from "fluent-ffmpeg"

import { askDictionary, getPhonetic } from "~/lib/apis/dictionary"

import { BotErrorMessage } from "~/structures/BotError"

import type {
  RESTAPIAttachment,
  RESTPostAPIChannelMessageJSONBody,
} from "discord.js"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (client, interaction) => {
    if (
      !interaction.isButton() ||
      !interaction.customId.startsWith("dictionary.") ||
      !interaction.channel?.isSendable()
    ) {
      return
    }

    await interaction.deferReply()

    if (interaction.customId.startsWith("dictionary.pronounce.")) {
      const word = interaction.customId.split(".")[2]!

      const dictionaryResponse = await askDictionary(word)

      if (!dictionaryResponse) {
        return void interaction.editReply(
          new BotErrorMessage("Could not find a word by that name."),
        )
      }

      const wordData = dictionaryResponse[0]
      const phonetic = getPhonetic(wordData)

      if (!phonetic) {
        return void interaction.editReply(
          new BotErrorMessage("Could not find a phonetic pronunciation."),
        )
      }

      const audioData = await processAudioURL(phonetic.audio)

      return void client.rest.patch(
        Routes.webhookMessage(client.user!.id, interaction.token),
        {
          body: {
            flags: MessageFlags.IsVoiceMessage,
            attachments: [
              {
                id: "0",
                filename: `${wordData.word}.ogg`,
                waveform: audioData.waveform,
                duration_secs: audioData.duration,
              } as RESTAPIAttachment,
            ],
          } satisfies RESTPostAPIChannelMessageJSONBody,
          files: [
            {
              name: `${wordData.word}.ogg`,
              contentType: "audio/ogg",
              data: audioData.oggBuffer,
            },
          ],
        },
      )
    }
  })

ffmpeg.setFfmpegPath(ffmpegPath!)

function downsampleBuffer(buffer: Buffer, targetLength: number): Buffer {
  const factor = Math.ceil(buffer.length / targetLength)
  const downsampled = []

  for (let i = 0; i < buffer.length; i += factor) {
    downsampled.push(buffer[i]!)
  }

  return Buffer.from(downsampled)
}

async function processAudioURL(url: string): Promise<{
  duration: number
  waveform: string
  oggBuffer: Buffer
}> {
  try {
    const { duration } = await new Promise<{ duration: number }>(
      (resolve, reject) => {
        ffmpeg.ffprobe(url, (err: Error, data) => {
          if (err) reject(err)
          resolve({ duration: data.format.duration ?? 0 })
        })
      },
    )

    const rawAudioStream = new PassThrough()
    const oggStream = new PassThrough()

    const waveformPromise = new Promise<Buffer>((resolve, reject) => {
      const buffers: Uint8Array[] = []
      rawAudioStream.on("data", (chunk: Uint8Array) => buffers.push(chunk))
      rawAudioStream.on("end", () => resolve(Buffer.concat(buffers)))
      rawAudioStream.on("error", reject)
    })

    const oggPromise = new Promise<Buffer>((resolve, reject) => {
      const buffers: Uint8Array[] = []
      oggStream.on("data", (chunk: Uint8Array) => buffers.push(chunk))
      oggStream.on("end", () => resolve(Buffer.concat(buffers)))
      oggStream.on("error", reject)
    })

    const throwErr = (err: Error) => {
      throw err
    }

    ffmpeg(url)
      .inputFormat("mp3")
      .audioCodec("pcm_s16le")
      .format("s16le")
      .on("error", throwErr)
      .pipe(rawAudioStream)

    ffmpeg(url)
      .inputFormat("mp3")
      .audioCodec("libvorbis")
      .format("ogg")
      .on("error", throwErr)
      .pipe(oggStream, { end: true })

    const [waveformBuffer, oggBuffer] = await Promise.all([
      waveformPromise,
      oggPromise,
    ])

    const downsampledWaveformBuffer = downsampleBuffer(waveformBuffer, 256)
    const waveform = downsampledWaveformBuffer.toString("base64")

    return { duration, waveform, oggBuffer }
  } catch (error) {
    throw new Error(`Failed to process audio: ${(error as Error).message}`)
  }
}
