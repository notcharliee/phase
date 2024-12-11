import type { BotClient } from "@phasejs/core/client"
import type { BotEmoji, BotEmojiWithId } from "~/types/emojis"
import type { OutdatedBotEmojis } from "~/types/outdated"

export async function syncEmojis(
  phase: BotClient<true>,
  emojis: OutdatedBotEmojis,
) {
  const manager = phase.client.application.emojis

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
    ...emojis.create.map(createEmoji),
    ...emojis.delete.map(deleteEmoji),
    ...emojis.update.map(updateEmoji),
  ])
}
