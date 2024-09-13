import { YouTubePlaylist, YouTubePlugin } from "@distube/youtube"

import { QueueManager } from "~/managers/queue"
import { VoiceManager } from "~/managers/voice"

import type { Client, GuildMember, VoiceBasedChannel } from "discord.js"

export enum MusicError {
  InvalidQuery = "Invalid query",
  PlaylistsNotSupported = "Playlists are not supported at this time",
}

export class Music {
  public readonly client: Client
  public readonly voices: VoiceManager
  public readonly queues: QueueManager
  public readonly youtube: YouTubePlugin

  constructor(client: Client) {
    this.client = client
    this.voices = new VoiceManager()
    this.queues = new QueueManager(this)
    this.youtube = new YouTubePlugin()

    client.on("voiceStateUpdate", (oldState, newState) => {
      const bot = oldState.guild.members.me!

      const botWasConnected = oldState.channel?.members.has(bot.id)
      const botIsStillConnected = newState.channel?.members.has(bot.id)

      if (!botWasConnected) return

      const botIsLonely = newState.channel?.members.size === 1

      if (botWasConnected && botIsStillConnected && botIsLonely) {
        bot.voice.disconnect()
      } else if (botWasConnected && !botIsStillConnected) {
        const queue = this.queues.get(oldState.guild.id)
        if (queue) queue.delete()
      }
    })
  }

  public async play(
    voiceChannel: VoiceBasedChannel,
    submitter: GuildMember,
    query: string,
  ) {
    const queue = this.queues.has(voiceChannel.guild.id)
      ? this.queues.get(voiceChannel.guild.id)!
      : this.queues.create(voiceChannel)

    const song = this.youtube.validate(query)
      ? await this.youtube.resolve(query, {}).catch(() => null)
      : await this.youtube.searchSong(query, {}).catch(() => null)

    if (!song) {
      throw new Error(MusicError.InvalidQuery)
    }

    if (song instanceof YouTubePlaylist) {
      throw new Error(MusicError.PlaylistsNotSupported)
    }

    const streamUrl = await this.youtube.getStreamURL(song)

    if (!streamUrl) {
      throw new Error(MusicError.InvalidQuery)
    }

    const addedSong = queue.addSong({
      url: song.url!,
      streamUrl: streamUrl,
      name: song.name!,
      duration: song.duration,
      formattedDuration: song.formattedDuration,
      thumbnail: song.thumbnail!,
      isLive: song.isLive ?? false,
      submittedAt: new Date(),
      submittedBy: submitter,
    })

    return addedSong
  }

  public getQueue(guildId: string) {
    return this.queues.get(guildId)
  }
}
