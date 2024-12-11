import perceptualHash from "sharp-phash"
import hashDistance from "sharp-phash/distance"

import type { BotEmoji } from "~/types/emojis"

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
