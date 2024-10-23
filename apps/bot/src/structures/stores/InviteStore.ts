import { BaseKVStore } from "phasebot/stores"

import type { Collection, Snowflake } from "discord.js"

export interface TrackedInvite {
  guildId: Snowflake
  inviterId: Snowflake | null
  code: string
  uses: number
  maxUses: number
  maxAge: number
  deleted: boolean
  createdTimestamp: number
  deletedTimestamp: number | null
}

export type TrackedInviteCollection = Collection<string, TrackedInvite>

export class InviteStore extends BaseKVStore<
  Snowflake,
  TrackedInviteCollection
> {}
