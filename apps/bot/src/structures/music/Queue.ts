import { AudioPlayerStatus } from "@discordjs/voice"

import { numberToDuration } from "~/lib/utils/formatting"

import type { Music } from "~/structures/music/Music"
import type { Song } from "~/structures/music/Song"
import type { Voice } from "~/structures/voice/Voice"
import type { Snowflake, VoiceBasedChannel } from "discord.js"

export enum QueueRepeatMode {
  Disabled = 0,
  Song = 1,
  Queue = 2,
}

export class Queue {
  public readonly id: Snowflake
  public readonly music: Music
  public readonly voice: Voice
  public readonly songs: Song[]

  public currentSongIndex: number | undefined
  public repeatMode: QueueRepeatMode

  constructor(music: Music, voiceChannel: VoiceBasedChannel) {
    this.id = voiceChannel.guild.id
    this.music = music
    this.voice = music.client.voices.create(voiceChannel)
    this.songs = []
    this.repeatMode = QueueRepeatMode.Disabled

    this.voice.player.on("stateChange", (oldState, newState) => {
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        if (this.currentSongIndex === undefined) return
        if (this.repeatMode === QueueRepeatMode.Song) {
          void this.voice.play(this.currentSong!.streamUrl)
        } else if (this.nextSong) {
          if (this.repeatMode !== QueueRepeatMode.Queue) this.currentSongIndex++
          void this.voice.play(this.currentSong!.streamUrl)
        } else {
          this.delete()
        }
      }
    })
  }

  public get currentSong() {
    return this.currentSongIndex !== undefined
      ? this.songs[this.currentSongIndex]!
      : null
  }

  public get previousSong(): Song | null {
    const isFirstSong = this.currentSongIndex === 0

    return isFirstSong
      ? this.repeatMode === QueueRepeatMode.Queue
        ? this.songs[this.songs.length - 1]!
        : null
      : this.songs[this.currentSongIndex! - 1]!
  }

  public get nextSong(): Song | null {
    const isLastSong = this.currentSongIndex === this.songs.length - 1

    return isLastSong
      ? this.repeatMode === QueueRepeatMode.Queue
        ? this.songs[0]!
        : null
      : this.songs[this.currentSongIndex! + 1]!
  }

  public get isPaused(): boolean {
    return this.voice.player.state.status === AudioPlayerStatus.Paused
  }

  public get duration(): number {
    return this.songs.reduce((acc, song) => acc + song.duration, 0)
  }

  public get durationRemaining(): number {
    if (!this.currentSong) return 0
    return this.songs
      .slice(this.currentSongIndex)
      .reduce(
        (acc, song) => acc + song.duration,
        -this.currentSong.playbackDuration,
      )
  }

  public get formattedDuration(): string {
    return numberToDuration(this.duration)
  }

  public get formattedDurationRemaining(): string {
    return numberToDuration(this.durationRemaining)
  }

  /**
   * Adds a song to the queue.
   *
   * @returns The added song.
   */
  public addSong(song: Song): Song {
    this.songs.push(song)

    if (!this.currentSong) {
      this.currentSongIndex = this.songs.length - 1
      void this.voice.play(this.currentSong!.streamUrl)
    }

    return song
  }

  /**
   * Removes a song from the queue.
   *
   * @returns The removed song.
   */
  public removeSong(song: Song): Song | undefined {
    if (!this.currentSong) return

    const songIndex = this.songs.indexOf(song)
    const currentSongIndex = this.songs.indexOf(this.currentSong)

    if (songIndex === -1) return

    const isCurrentSong = songIndex === currentSongIndex

    if (isCurrentSong) {
      if (!this.nextSong) return void this.delete()

      this.currentSongIndex!++
      void this.voice.play(this.currentSong.streamUrl)
    }

    return song
  }

  /**
   * Shuffles any succeeding songs in the queue.
   *
   * @returns The shuffled songs.
   */
  public shuffleSongs(): Song[] | undefined {
    if (!this.currentSongIndex || !this.nextSong) return

    const songsToShuffle = this.songs.slice(this.currentSongIndex + 1)
    songsToShuffle.sort(() => Math.random() - 0.5)

    Reflect.set(this, "songs", [
      ...this.songs.slice(0, this.currentSongIndex + 1),
      ...songsToShuffle,
    ])

    return this.songs
  }

  /**
   * Skips the current song.
   *
   * @returns The new current song if one exists, otherwise `null`.
   */
  public skip(): Song | null {
    if (!this.nextSong) {
      this.delete()
      return null
    }

    this.currentSongIndex!++
    void this.voice.play(this.currentSong!.streamUrl)

    return this.currentSong
  }

  /**
   * Plays the previous song.
   *
   * @returns The previous song if one exists, otherwise `null`.
   */
  public playPreviousSong(): Song | null {
    if (!this.previousSong) return null

    void this.voice.play(this.previousSong.streamUrl)

    return this.previousSong
  }

  /**
   * Pauses the queue.
   */
  public pause() {
    this.voice.pause()
  }

  /**
   * Resumes the queue.
   */
  public resume() {
    this.voice.resume()
  }

  /**
   * Sets the repeat mode of the queue.
   */
  public setRepeatMode(repeatMode: QueueRepeatMode) {
    this.repeatMode = repeatMode
  }

  /**
   * Deletes the queue and destroys the voice connection.
   */
  public delete() {
    this.voice.destroy()
    this.music.queues.delete(this.id)
  }
}
