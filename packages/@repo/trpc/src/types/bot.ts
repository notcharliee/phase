import type { StoreManager } from "@phasejs/core/managers"
import type { BaseKVStore, BaseStore } from "@phasejs/core/stores"
import type { Config, Guild, mongoose } from "@repo/db"
import type { Client, Snowflake } from "discord.js"

import type {} from "@phasejs/core/client"

type WithId<T> = T & { _id: mongoose.Types.ObjectId }

export interface Streamer {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  description: string
  stream?: {
    id: string
    url: string
    title: string
    game: string
    tags: string[]
    viewerCount: number
    thumbnailUrl: string
    startedAt: Date
  }
  notifications: {
    guildId: string
    channelId: string
    mention?: string
  }[]
}

type ConfigStore = BaseStore & Config
type GuildStore = BaseKVStore<Snowflake, WithId<Guild>>
type StreamersStore = BaseKVStore<string, Streamer>

export interface DjsClient<T extends boolean = boolean> extends Client<T> {
  stores: StoreManager & {
    config: ConfigStore
    guilds: GuildStore
    streamers: StreamersStore
  }
}
