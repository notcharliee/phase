import { BaseKVStore } from "@phasejs/core/stores"

import { db } from "~/lib/db"

import type { Guild, mongoose } from "~/lib/db"
import type { Snowflake } from "discord.js"

type WithId<T> = T & { _id: mongoose.Types.ObjectId }

export class GuildStore extends BaseKVStore<Snowflake, WithId<Guild>> {
  public async init() {
    if (this._init) return this

    const guildDocs = await db.guilds.find({})
    const guildObjs = guildDocs.map((doc) => doc.toObject())

    for (const guild of guildObjs) {
      this.set(guild.id, guild)
    }

    type GuildObject = (typeof guildObjs)[number]
    type GuildChangeStreamDoc = mongoose.mongo.ChangeStreamDocument<GuildObject>

    db.guilds
      .watch([], { fullDocument: "updateLookup" })
      .on("change", (change: GuildChangeStreamDoc) => {
        if (!("documentKey" in change)) return

        if (change.operationType === "delete") {
          const guildId =
            change.fullDocumentBeforeChange?.id ??
            this.find(
              (guildDoc) =>
                guildDoc._id.toString() === change.documentKey._id.toString(),
            )?.id

          if (guildId) this.delete(guildId)
        } else {
          const fullDocument = change.fullDocument!
          const guildId = fullDocument.id
          this.set(guildId, fullDocument)
        }
      })

    this._init = true
    return this
  }
}
