import { BotPlugin } from "@phasejs/core/client"

import perceptualHash from "sharp-phash"
import hashDistance from "sharp-phash/distance"

import { version } from "../package.json"

import type { BotPluginVersion, DjsClient } from "@phasejs/core"
import type { Base64Resolvable, BufferResolvable } from "discord.js"

export type BotEmojiId = string
export type BotEmojiType = "png" | "jpg" | "jpeg" | "gif"
export type BotEmojiData = BufferResolvable | Base64Resolvable

export interface BotEmoji {
  id?: BotEmojiId
  name: string
  type: BotEmojiType
  data: BotEmojiData
}

export type BotEmojiWithId = Required<BotEmoji>

export interface OutdatedBotEmojis {
  create: BotEmoji[]
  delete: BotEmojiWithId[]
  update: BotEmojiWithId[]
}

export async function isSameEmoji(
  emoji1: BotEmoji,
  emoji2: BotEmoji,
  maxDistance = 5,
): Promise<boolean> {
  const [phash1, phash2] = await Promise.all([
    await perceptualHash(emoji1.data, { animated: emoji1.type === "gif" }),
    await perceptualHash(emoji2.data, { animated: emoji2.type === "gif" }),
  ])

  const distance = hashDistance(phash1, phash2)
  const isSame = distance <= maxDistance

  return isSame
}

export async function getOutdatedEmojis(
  client: DjsClient<true>,
  emojis: BotEmoji[],
): Promise<OutdatedBotEmojis> {
  const appEmojis = await client.application.emojis.fetch()

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

export async function syncEmojis(
  client: DjsClient<true>,
  outdatedEmojis: OutdatedBotEmojis,
) {
  const manager = client.application.emojis

  const createEmoji = async (emoji: BotEmoji) => {
    await manager.create({ ...emoji, attachment: emoji.data })
  }

  const deleteEmoji = async (emoji: BotEmojiWithId) => {
    await manager.delete(emoji.id)
  }

  const updateEmoji = async (emoji: BotEmojiWithId) => {
    await manager.delete(emoji.id)
    await createEmoji(emoji)
  }

  await Promise.all([
    ...outdatedEmojis.create.map(createEmoji),
    ...outdatedEmojis.delete.map(deleteEmoji),
    ...outdatedEmojis.update.map(updateEmoji),
  ])
}

export function emojiSyncPlugin(emojis: BotEmoji[]) {
  return new BotPlugin({
    name: "emoji-sync",
    trigger: "ready",
    version: version as BotPluginVersion,
    onLoad: async (phase) => {
      const outdatedEmojis = await getOutdatedEmojis(phase.client, emojis)

      if (
        outdatedEmojis.create.length ||
        outdatedEmojis.delete.length ||
        outdatedEmojis.update.length
      ) {
        await syncEmojis(phase.client, outdatedEmojis)
      }
    },
  })
}
