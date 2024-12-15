import { Collection } from "discord.js"

import { Entry, EntryType } from "~/structures/Entry"

import type { BotClient } from "@phasejs/core/client"
import type { EntryCreateOptions, EntryEditOptions } from "~/structures/Entry"
import type { Guild, Snowflake } from "discord.js"

export class Blacklist {
  public readonly phase: BotClient
  private readonly entries: Collection<Snowflake, Entry>

  constructor(phase: BotClient, entries?: Iterable<[Snowflake, Entry]>) {
    this.phase = phase
    this.entries = new Collection(entries)
  }

  public get guilds() {
    return this.entries.filter((entry) => entry.type === EntryType.Guild)
  }

  public get users() {
    return this.entries.filter((entry) => entry.type === EntryType.User)
  }

  /**
   * Checks if a guild or its owner is blacklisted.
   */
  public check(guild: Guild) {
    const guildId = guild.id
    const ownerId = guild.ownerId

    const blacklistedGuild = this.guilds.get(guildId)
    const blacklistedUser = this.users.get(ownerId)

    return blacklistedGuild ?? blacklistedUser
  }

  /**
   * Creates a new blacklist entry.
   */
  public create(entry: Entry | EntryCreateOptions) {
    const newEntry = entry instanceof Entry ? entry : new Entry(entry)

    this.entries.set(newEntry.id, newEntry)
    void this.phase.emitter.emit("blacklist.entryCreate", newEntry)

    return newEntry
  }

  /**
   * Deletes an existing blacklist entry.
   */
  public delete(id: Snowflake) {
    const entry = this.entries.get(id)
    if (!entry) return false

    this.entries.delete(id)
    void this.phase.emitter.emit("blacklist.entryDelete", entry)

    return true
  }

  /**
   * Edits an existing blacklist entry.
   */
  public edit(id: Snowflake, options: EntryEditOptions) {
    const entry = this.entries.get(id)
    if (!entry) return

    entry.reason = options.reason
    void this.phase.emitter.emit("blacklist.entryEdit", entry)

    return entry
  }
}
