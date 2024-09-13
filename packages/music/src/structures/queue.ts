import { Snowflake, VoiceBasedChannel } from "discord.js"

import { AudioPlayerStatus } from "@discordjs/voice"

import { formatDuration } from "~/utils"

import type { Music } from "~/structures/music"
import type { Song } from "~/structures/song"
import type { Voice } from "~/structures/voice"

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
    this.voice = music.voices.create(voiceChannel)
    this.songs = []
    this.repeatMode = QueueRepeatMode.Disabled

    this.voice.audioPlayer.on("stateChange", (oldState, newState) => {
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        if (this.repeatMode === QueueRepeatMode.Song) {
          this.voice.play(this.currentSong!)
        } else {
          if (!this.nextSong) return this.delete()
          this.currentSongIndex!++
          this.voice.play(this.currentSong!)
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
    if (!this.currentSong) return null

    const previousSongIndex =
      this.currentSongIndex === 0
        ? this.repeatMode === QueueRepeatMode.Queue
          ? this.songs.length - 1
          : this.currentSongIndex - 1
        : null

    const previousSong =
      previousSongIndex !== null ? this.songs[previousSongIndex] : null

    return previousSong ?? null
  }

  public get nextSong(): Song | null {
    if (!this.currentSong) return null

    const nextSongIndex =
      this.currentSongIndex === this.songs.length - 1
        ? this.repeatMode === QueueRepeatMode.Queue
          ? 0
          : this.currentSongIndex + 1
        : null

    const nextSong = nextSongIndex !== null ? this.songs[nextSongIndex] : null

    return nextSong ?? null
  }

  public get isPaused(): boolean {
    return this.voice.audioPlayer.state.status === AudioPlayerStatus.Paused
  }

  public get duration(): number {
    return this.songs.reduce((acc, song) => acc + song.duration, 0)
  }

  public get durationRemaining(): number {
    if (!this.currentSong) return 0
    return this.songs
      .slice(this.currentSongIndex!)
      .reduce(
        (acc, song) => acc + song.duration,
        -this.currentSong.playbackDuration,
      )
  }

  public get formattedDuration(): string {
    return formatDuration(this.duration)
  }

  public get formattedDurationRemaining(): string {
    return formatDuration(this.durationRemaining)
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
      this.voice.play(this.currentSong!)
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
      this.voice.play(this.currentSong)
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
    this.voice.play(this.currentSong!)

    return this.currentSong
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
    this.music.queues.delete(this.id)
    this.voice.leave()
  }
}
