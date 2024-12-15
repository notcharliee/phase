import { BotPlugin } from "@phasejs/core/client"

import { getOutdatedEmojis } from "~/lib/outdated"
import { syncEmojis } from "~/lib/sync"
import { version } from "~/lib/utils"

import type { BotEmoji, BotEmojiString } from "~/types/emojis"
import type { Awaitable } from "~/types/utils"

type BotEmojiRecord = Record<string, BotEmoji>
type BotEmojiLoader<TEmojis extends BotEmojiRecord> = () => Awaitable<TEmojis>
type BotEmojiStringRecord<TEmojis extends BotEmojiRecord> = Record<
  keyof TEmojis,
  BotEmojiString
>

declare global {
  // eslint-disable-next-line no-var
  var emojiSync: EmojiSync<BotEmojiRecord>
}

export class EmojiSync<TEmojis extends BotEmojiRecord> {
  public readonly loader!: BotEmojiLoader<TEmojis>
  public readonly emojis!: BotEmojiStringRecord<TEmojis>

  constructor(loader: BotEmojiLoader<TEmojis>) {
    if (!globalThis.emojiSync) {
      this.emojis = {} as BotEmojiStringRecord<TEmojis>
      this.loader = loader
      globalThis.emojiSync = this
    }

    return globalThis.emojiSync as this
  }

  public plugin() {
    return new BotPlugin({
      name: "emoji-sync",
      trigger: "ready",
      version: version,
      onLoad: async (phase) => {
        // load emoji files
        const emojiRecord = await this.loader()
        const emojiArray = Object.values(emojiRecord)

        // compare local and live emojis
        const outdatedEmojis = await getOutdatedEmojis(phase, emojiArray)

        if (
          outdatedEmojis.create.length +
          outdatedEmojis.delete.length +
          outdatedEmojis.update.length
        ) {
          // sync emojis if any are outdated
          await syncEmojis(phase, outdatedEmojis)
        }

        // update emojis in this.emojis
        for (const [key, botEmoji] of Object.entries(emojiRecord)) {
          const appEmojis = phase.client.application.emojis.cache
          const appEmoji = appEmojis.find((e) => e.name === botEmoji.name)!
          this.emojis[key as keyof typeof this.emojis] =
            `<${appEmoji.animated ? "a" : ""}:${appEmoji.name}:${appEmoji.id}>`
        }
      },
    })
  }
}
