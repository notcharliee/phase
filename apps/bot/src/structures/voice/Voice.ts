import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
} from "@discordjs/voice"
import ffmpegPath from "ffmpeg-static"
import ffmpeg from "fluent-ffmpeg"

import type {
  AudioPlayer,
  AudioResource,
  VoiceConnection,
} from "@discordjs/voice"
import type { VoiceManager } from "~/structures/voice/VoiceManager"
import type { Guild, VoiceBasedChannel } from "discord.js"
import type { Readable } from "node:stream"

ffmpeg.setFfmpegPath(ffmpegPath!)

/**
 * Represents a connection to a voice channel.
 */
export class Voice {
  private readonly manager: VoiceManager

  public readonly guild: Guild
  public readonly channel: VoiceBasedChannel
  public readonly connection: VoiceConnection

  public player: AudioPlayer
  public resource?: AudioResource
  public lastSilentAt: number

  constructor(
    manager: VoiceManager,
    {
      guild,
      channel,
      connection,
    }: {
      guild: Guild
      channel: VoiceBasedChannel
      connection: VoiceConnection
    },
  ) {
    this.manager = manager
    this.guild = guild
    this.channel = channel
    this.connection = connection
    this.player = this.createAudioPlayer()
    this.lastSilentAt = Date.now()
  }

  /**
   * Creates an audio player.
   *
   * @internal
   */
  private createAudioPlayer(): AudioPlayer {
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Stop,
        maxMissedFrames: Math.round(5000 / 20),
      },
    })

    player.on("error", (error) => {
      console.error(`AudioPlayer error: ${error.message}`)
      console.error(error)
      this.destroy()
    })

    player.on("stateChange", (_oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        this.cleanUp()
      }

      if (
        newState.status === AudioPlayerStatus.Idle ||
        newState.status === AudioPlayerStatus.Paused ||
        newState.status === AudioPlayerStatus.AutoPaused
      ) {
        this.lastSilentAt = Date.now()
      }
    })

    return player
  }

  /**
   * Cleans up the audio stream and audio player.
   *
   * @internal
   */
  private cleanUp() {
    if (this.player.state.status !== AudioPlayerStatus.Idle) {
      this.player.stop(true)
    }

    if (this.resource) {
      this.resource = undefined
    }
  }

  /**
   * Joins the voice channel and subscribes to the audio player.
   */
  public async join() {
    try {
      await entersState(this.connection, VoiceConnectionStatus.Ready, 30_000)
      this.connection.subscribe(this.player)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`VoiceConnection error: ${error.message}`)
        console.error(error)
        return this.destroy()
      } else {
        throw error
      }
    }
  }

  /**
   * Plays a song through the audio player. When called, any currently playing
   * song will be stopped.
   */
  public async play(url: string) {
    await this.join()

    this.resource = createAudioResource(
      ffmpeg(url)
        .inputOptions(["-analyzeduration", "0", "-loglevel", "0"])
        .audioCodec("libopus")
        .audioChannels(2)
        .audioFrequency(48000)
        .format("opus")
        .on("error", (error: Error) => {
          console.error(`FFmpeg error: ${error.message}`)
          console.error(error)
          this.cleanUp()
        })
        .pipe() as Readable,
      {
        inputType: StreamType.OggOpus,
        inlineVolume: false,
      },
    )

    this.player.play(this.resource)
  }

  /**
   * Pauses the audio player.
   */
  public pause() {
    if (!this.player) return
    this.player.pause()
  }

  /**
   * Resumes the audio player.
   */
  public resume() {
    if (!this.player) return
    this.player.unpause()
  }

  /**
   * Destroys the audio player and voice connection, then removes the `Voice`
   * instance from the `VoiceManager`.
   */
  public destroy() {
    this.cleanUp()

    if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
      this.connection.destroy()
    }

    this.manager.voices.delete(this.guild.id)
  }
}
