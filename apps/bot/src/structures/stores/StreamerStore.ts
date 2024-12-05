import { BaseKVStore } from "@phasejs/core/stores"

import { ModuleId } from "@repo/utils/modules"

import { twitchAPI } from "~/lib/clients/twitch"

import type { Client } from "discord.js"

export interface StreamerUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  description: string
}

export interface StreamerStream {
  id: string
  url: string
  title: string
  game: string
  tags: string[]
  viewerCount: number
  thumbnailUrl: string
  startedAt: Date
}

export interface StreamerNotification {
  guildId: string
  channelId: string
  mention?: string
}

export interface Streamer extends StreamerUser {
  stream?: StreamerStream
  notifications: StreamerNotification[]
}

export class StreamerStore extends BaseKVStore<string, Streamer> {
  private client!: Client
  private userCache!: Map<string, StreamerUser>

  public async init(client: Client) {
    if (this._init) return this

    this.client = client
    this.userCache = new Map()

    // populate the store with the streamers
    await this.refreshStreamers()

    this._init = true
    return this
  }

  public async refreshStreamers() {
    // clear the store if it has any entries
    if (this.size > 0) this.clear()

    // get all guilds with twitch notifications enabled
    const guildDocs = this.client.stores.guilds
      .filter((g) => g.modules?.[ModuleId.TwitchNotifications]?.enabled)
      .values()

    // loop over each guild and get the streamers
    for (const guildDoc of guildDocs) {
      const streamers =
        guildDoc.modules![ModuleId.TwitchNotifications]!.streamers

      // loop over each streamer and fetch their data
      for (const { id, channel, mention } of streamers) {
        const streamerData = this.get(id) ?? (await this.fetchStreamer(id))
        if (!streamerData) continue

        // add the guild to the streamer notifications array
        streamerData.notifications.push({
          guildId: guildDoc.id,
          channelId: channel,
          mention: mention,
        })

        // update the streamer data in the store
        this.set(id, streamerData)
      }
    }
  }

  private async fetchStreamer(id: string, force = false) {
    // get the streamer user data
    const streamerUser = await this.fetchStreamerUser(id, force)
    if (!streamerUser) return

    // get the streamer stream data
    const streamerStream = await this.fetchStreamerStream(id)

    // format the streamer data
    const streamer: Streamer = {
      ...streamerUser,
      stream: streamerStream,
      notifications: [],
    }

    return streamer
  }

  private async fetchStreamerUser(id: string, force = false) {
    // check if the user is already cached
    const cachedUser = this.userCache.get(id)
    if (cachedUser && !force) return cachedUser

    // fetch the user from the twitch api
    const user = await twitchAPI.users.getUserById(id)
    if (!user) return

    // format the user data
    const streamerUser: StreamerUser = {
      id: user.id,
      username: user.name,
      displayName: user.displayName,
      avatarUrl: user.profilePictureUrl,
      description: user.description,
    }

    // cache the user
    this.userCache.set(id, streamerUser)

    return streamerUser
  }

  private async fetchStreamerStream(id: string) {
    // fetch the stream from the twitch api
    const stream = await twitchAPI.streams.getStreamByUserId(id)
    if (!stream) return

    // format the stream data
    const streamerStream: StreamerStream = {
      id: stream.id,
      url: `https://twitch.tv/${stream.userName}`,
      title: stream.title,
      game: stream.gameName,
      tags: stream.tags,
      viewerCount: stream.viewers,
      thumbnailUrl: `${stream.getThumbnailUrl(400, 225)}?t=${Date.now()}`,
      startedAt: stream.startDate,
    }

    return streamerStream
  }
}
