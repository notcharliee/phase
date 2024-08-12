import { PersistentCache } from "@repo/cache"

import { db } from "~/lib/db"

import type { mongoose } from "~/lib/db"

const guildDocs = await db.guilds.find({})
const guildObjs = guildDocs.map((doc) => doc.toObject())

type GuildObject = (typeof guildObjs)[number]

const guildsRecord = guildObjs.reduce<
  Record<string, (typeof guildObjs)[number]>
>((acc, guild) => {
  acc[guild.id] = guild
  return acc
}, {})

export const guildsCache = await new PersistentCache({
  filePath: "./.cache/guilds.bson",
}).init(guildsRecord)

db.guilds
  .watch([], { fullDocument: "updateLookup" })
  .on(
    "change",
    async (change: mongoose.mongo.ChangeStreamDocument<GuildObject>) => {
      if (!("documentKey" in change)) return

      if (change.operationType === "delete") {
        const guildId =
          change.fullDocumentBeforeChange?.id ??
          (await guildsCache.values()).find(
            (guildDoc) =>
              guildDoc._id.toString() === change.documentKey._id.toString(),
          )?.id

        if (guildId) await guildsCache.delete(guildId)
      } else {
        const fullDocument = change.fullDocument!
        const guildId = fullDocument.id
        await guildsCache.set(guildId, fullDocument)
      }
    },
  )
