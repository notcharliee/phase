import { YouTubePlaylist, YouTubePlugin } from "@distube/youtube"

import { QueueManager } from "~/structures/music/QueueManager"
import { Song } from "~/structures/music/Song"

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
    query: string,
  ): Promise<Song[]> {
    const queue = this.queues.has(voiceChannel.guild.id)
      ? this.queues.get(voiceChannel.guild.id)!
      : this.queues.create(voiceChannel)

    const youtubeSongOrPlaylist = this.youtube.validate(query)
      ? await this.youtube.resolve(query, {}).catch(() => null)
      : await this.youtube.searchSong(query, {}).catch(() => null)

    if (!youtubeSongOrPlaylist) {
      throw new Error(MusicError.InvalidQuery)
    }

    if (youtubeSongOrPlaylist instanceof YouTubePlaylist) {
      const youtubePlaylist = youtubeSongOrPlaylist

      const newSongs: Song[] = []

      for (const youtubeSong of youtubePlaylist.songs) {
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

        newSongs.push(song)
        queue.addSong(song)
      }

      return newSongs
    } else {
      const youtubeSong = youtubeSongOrPlaylist

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

      return [song]
    }
  }

  /**
   * Gets the queue for a guild.
   */
  public getQueue(guildId: string) {
    return this.queues.get(guildId)
  }

  static plugin(this: void, client: Client<false>) {
    Object.assign(client, { music: new Music(client) })
    return client
  }
}
