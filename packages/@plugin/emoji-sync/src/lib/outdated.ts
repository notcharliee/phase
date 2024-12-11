import { isSameEmoji } from "~/lib/compare"

import type { BotClient } from "@phasejs/core/client"
import type { BotEmoji, BotEmojiWithId } from "~/types/emojis"
import type { OutdatedBotEmojis } from "~/types/outdated"

export async function getOutdatedEmojis(
  phase: BotClient<true>,
  emojis: BotEmoji[],
): Promise<OutdatedBotEmojis> {
  const appEmojis = await phase.client.application.emojis.fetch()

  const emojisToCreate: BotEmoji[] = emojis.filter(
    (emoji) => !appEmojis.find((e) => e.name === emoji.name),
  )

  const emojisToDelete: BotEmojiWithId[] = appEmojis
    .filter((appEmoji) => !emojis.find((e) => e.name === appEmoji.name))
    .map((appEmoji) => ({
      id: appEmoji.id,
      name: null as never,
      type: null as never,
      data: null as never,
    }))

  const emojisToUpdate: BotEmojiWithId[] = []

  await Promise.all(
    emojis
      .filter((e) => !emojisToCreate.includes(e))
      .map(async (emoji) => {
        const appEmoji = appEmojis.find((e) => e.name === emoji.name)!
        const appEmojiImageURL = appEmoji.imageURL({ extension: emoji.type })

        if (!appEmojiImageURL) {
          console.error(`Could not find image URL for emoji '${appEmoji.name}'`)
          return
        }

        const appEmojiImageReq = await fetch(appEmojiImageURL)
        const appEmojiImageAB = await appEmojiImageReq.arrayBuffer()
        const appEmojiImageBuffer = Buffer.from(appEmojiImageAB)

        const localEmoji: BotEmojiWithId = {
          ...emoji,
          id: appEmoji.id,
        }

        const liveEmoji: BotEmojiWithId = {
          ...localEmoji,
          data: appEmojiImageBuffer,
        }

        const isSame = await isSameEmoji(localEmoji, liveEmoji)
        if (!isSame) emojisToUpdate.push(localEmoji)
      }),
  )

  return {
    create: emojisToCreate,
    delete: emojisToDelete,
    update: emojisToUpdate,
  }
}
