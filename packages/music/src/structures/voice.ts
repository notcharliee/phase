import { Readable } from "node:stream"

import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
} from "@discordjs/voice"
import ffmpegPath from "ffmpeg-static"

import type {
  AudioPlayer,
  AudioResource,
  DiscordGatewayAdapterCreator,
  VoiceConnection,
} from "@discordjs/voice"
import type { VoiceManager } from "~/managers/voice"
import type { Song } from "~/structures/song"
import type { Snowflake, VoiceBasedChannel } from "discord.js"

export class Voice {
  public readonly id: Snowflake
  public readonly voices: VoiceManager
  public readonly audioPlayer: AudioPlayer

  public audioResource?: AudioResource
  public voiceConnection!: VoiceConnection

  constructor(voiceManager: VoiceManager, voiceChannel: VoiceBasedChannel) {
    this.id = voiceChannel.id
    this.voices = voiceManager
    this.voiceChannel = voiceChannel
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Stop,
        maxMissedFrames: Math.round(5000 / 20),
      },
    })
  }

  public get playbackDuration() {
    return Math.floor((this.audioResource?.playbackDuration ?? 0) / 1000)
  }

  public set voiceChannel(voiceChannel: VoiceBasedChannel) {
    this.voiceConnection = joinVoiceChannel({
      guildId: voiceChannel.guild.id,
      channelId: voiceChannel.id,
      adapterCreator: voiceChannel.guild
        .voiceAdapterCreator as DiscordGatewayAdapterCreator,
    })

    this.join()
  }

  /**
   * Joins the voice channel.
   */
  public async join(voiceChannel?: VoiceBasedChannel) {
    if (voiceChannel) this.voiceChannel = voiceChannel

    try {
      await entersState(
        this.voiceConnection,
        VoiceConnectionStatus.Ready,
        30_000,
      )
    } catch (error) {
      console.error("Failed to join voice channel")
      this.voiceConnection.destroy()
      throw error
    }

    this.voiceConnection.subscribe(this.audioPlayer)
  }

  /**
   * Leaves the voice channel.
   */
  public leave() {
    this.stop(true)

    if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) {
      this.voiceConnection.destroy()
    }

    this.voices.delete(this.id)
  }

  /**
   * Plays a song. If any audio is already playing, it will be stopped.
   */
  public play(song: Song) {
    if (this.audioResource) {
      this.stop(true)
    }

    // prettier-ignore
    const ffmpegArgs = [
      "-analyzeduration", "0",  // skip input stream analysis for faster processing
      "-loglevel", "0",         // minimal log output
      "-i", song.streamUrl,     // input stream URL
      "-f", "s16le",            // output raw PCM audio in 16-bit little-endian format
      "-ar", "48000",           // set audio sample rate to 48 kHz (discord standard)
      "-ac", "2",               // set stereo (2 channels)
      "-"                       // pipe output to stdout
    ]

    const subprocess = Bun.spawn({
      cmd: [ffmpegPath!, ...ffmpegArgs],
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    })

    if (!subprocess.stdout || !subprocess.stderr) {
      throw new Error("Failed to spawn FFmpeg process")
    }

    const stdoutReadable = Readable.from(subprocess.stdout)
    const stderrReadable = Readable.from(subprocess.stderr)

    stdoutReadable.on("close", () => {
      subprocess.kill()
    })

    stderrReadable.setEncoding("utf8").on("data", (data) => {
      const lines = data.split(/\r\n|\r|\n/u)
      for (const line of lines) {
        if (/^\s*$/.test(line)) continue
        console.error(`FFmpeg error: ${line}`)
      }
    })

    this.audioResource = createAudioResource(stdoutReadable, {
      inputType: StreamType.Raw,
      inlineVolume: false,
    })

    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause()
    }

    this.audioPlayer.play(this.audioResource)
  }

  /**
   * Stops the audio.
   */
  public stop(force = false) {
    this.audioPlayer.stop(force)
  }

  /**
   * Pauses the audio.
   */
  public pause() {
    this.audioPlayer.pause()
  }

  /**
   * Resumes the audio.
   */
  public resume() {
    this.audioPlayer.unpause()
  }
}
