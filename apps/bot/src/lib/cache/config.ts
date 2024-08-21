import { PersistentCache } from "@repo/cache"

import { db } from "~/lib/db"

import type { mongoose } from "~/lib/db"

const botConfigDoc = (await db.configs.findOne({}))!
const botConfigObj = botConfigDoc.toObject()

export const configsCache = await new PersistentCache({
  filePath: "./.cache/configs.bson",
}).init({ bot: botConfigObj })

db.configs
  .watch([], { fullDocument: "updateLookup" })
  .on(
    "change",
    async (
      change: mongoose.mongo.ChangeStreamDocument<typeof botConfigObj>,
    ) => {
      if (!("documentKey" in change)) return

      if (change.operationType === "delete") {
        throw new Error("Not implemented")
      } else {
        const fullDocument = change.fullDocument!
        await configsCache.set("bot", fullDocument)
      }
    },
  )
