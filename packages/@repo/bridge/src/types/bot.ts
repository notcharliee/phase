import type { BaseKVStore, BaseStore } from "@phasejs/core/stores"
import type { Config, Guild, mongoose } from "@repo/db"
import type { Snowflake } from "discord.js"

import type {} from "@phasejs/core/client"
import type {} from "@phasejs/core/managers"

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

declare module "@phasejs/core/managers" {
  interface StoreManager {
    config: ConfigStore
    guilds: GuildStore
    streamers: StreamersStore
  }
}

export type { DjsClient } from "@phasejs/core"
