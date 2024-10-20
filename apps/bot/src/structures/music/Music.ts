import { YouTubePlaylist, YouTubePlugin } from "@distube/youtube"

import { QueueManager } from "~/structures/music/QueueManager"
import { Song } from "~/structures/music/Song"

import type { YouTubeSong } from "@distube/youtube"
import type { Queue } from "~/structures/music/Queue"
import type { Client, GuildMember, VoiceBasedChannel } from "discord.js"

export enum MusicError {
  InvalidQuery = "Invalid query",
}

export class Music {
  public readonly client: Client
  public readonly queues: QueueManager
  public readonly youtube: YouTubePlugin

  constructor(client: Client) {
    this.client = client
    this.queues = new QueueManager(this)
    this.youtube = new YouTubePlugin()
  }

  /**
   * Plays a song or playlist.
   *
   * @returns An array of songs that were added to the queue.
   */
  public async play(
    voiceChannel: VoiceBasedChannel,
    submitter: GuildMember,
    queryOrSong: string | YouTubePlaylist<unknown> | YouTubeSong<unknown>,
  ): Promise<Song[]> {
    const queue = this.queues.has(voiceChannel.guild.id)
      ? this.queues.get(voiceChannel.guild.id)!
      : this.queues.create(voiceChannel)

    const youtubeSongOrPlaylist =
      typeof queryOrSong === "string"
        ? await this.search(queryOrSong)
        : queryOrSong

    const newSongs: Song[] = []

    if (youtubeSongOrPlaylist instanceof YouTubePlaylist) {
      for (const youtubeSong of youtubeSongOrPlaylist.songs) {
        const song = await this.addSongToQueue(queue, youtubeSong, submitter)

        newSongs.push(song)
      }
    } else {
      const youtubeSong = youtubeSongOrPlaylist
      const song = await this.addSongToQueue(queue, youtubeSong, submitter)

      newSongs.push(song)
    }

    return newSongs
  }

  public async search(query: string) {
    const youtubeSongOrPlaylist = this.youtube.validate(query)
      ? await this.youtube.resolve(query, {}).catch(() => null)
      : await this.youtube.searchSong(query, {}).catch(() => null)

    if (!youtubeSongOrPlaylist) {
      throw new Error(MusicError.InvalidQuery)
    }

    return youtubeSongOrPlaylist
  }

  /**
   * Gets the queue for a guild.
   *
   * @returns The queue for the guild, or null if there is no queue.
   */
  public getQueue(guildId: string) {
    return this.queues.get(guildId)
  }

  /**
   * Adds a song to a queue.
   *
   * @returns The song that was added to the queue.
   */
  public async addSongToQueue(
    queue: Queue,
    youtubeSong: YouTubeSong,
    submitter: GuildMember,
  ) {
    const streamUrl = await this.youtube
      .getStreamURL(youtubeSong)
      .catch(() => null)

    if (!streamUrl) {
      throw new Error(MusicError.InvalidQuery)
    }

    const song = new Song(queue, {
      name: youtubeSong.name!,
      thumbnail: youtubeSong.thumbnail!,
      duration: youtubeSong.duration,
      url: youtubeSong.url!,
      streamUrl,
      submitter,
    })

    queue.addSong(song)

    return song
  }
}
