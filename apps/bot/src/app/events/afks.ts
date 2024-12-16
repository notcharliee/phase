import { BotEventBuilder } from "@phasejs/builders"
import { userMention } from "discord.js"

import { db } from "~/lib/db"

import { MessageBuilder } from "~/structures/builders"

export default new BotEventBuilder()
  .setName("messageCreate")
  .setExecute(async (_, message) => {
    const afkDoc = await db.afks.findOneAndDelete({ user: message.author.id })

    if (afkDoc) {
      await message.reply(
        new MessageBuilder().setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setTitle("AFK Status Changed")
            .setDescription("You are no longer AFK.")
        }),
      )
    }

    const mentionedUsers = message.mentions.users.map((user) => user.id)
    if (!mentionedUsers) return

    const afkUserIds = (
      await Promise.all(
        mentionedUsers.map(async (user) => {
          const exists = await db.afks.exists({ user })
          return exists ? user : null
        }),
      )
    ).filter(Boolean)

    if (!afkUserIds.length) return

    const mentions = afkUserIds.map((id) => userMention(id)).join(", ")
    const linkingVerb = afkUserIds.length > 1 ? "are" : "is"

    await message.reply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("AFK Users Mentioned")
          .setDescription(`${mentions} ${linkingVerb} currently AFK.`)
      }),
    )
  })
