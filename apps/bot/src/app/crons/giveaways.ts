import { BotCronBuilder } from "@phasejs/builders"

import { db } from "~/lib/db"
import { Emojis } from "~/lib/emojis"

import { MessageBuilder } from "~/structures/builders/MessageBuilder"

import type { GuildTextBasedChannel, User } from "discord.js"

export default new BotCronBuilder()
  .setPattern("*/5 * * * * *") // every 5 seconds
  .setExecute(async (client) => {
    const expiredGiveaways = await db.giveaways.find({
      expires: { $lt: Date.now().toString() },
      expired: false,
    })

    for (const giveaway of expiredGiveaways) {
      const channel = client.channels.cache.get(giveaway.channel) as
        | GuildTextBasedChannel
        | undefined

      if (!channel) {
        await giveaway.deleteOne()
        return
      }

      try {
        const message = await channel.messages.fetch(giveaway.id as string)
        const host = await channel.guild.members.fetch(giveaway.host)
        const entries = await message.reactions.cache
          .get(Emojis.GiveawayReaction)
          ?.users.fetch()

        const filter = (user: User) => user.id !== client.user.id

        if (!entries?.filter(filter).size) {
          await giveaway.deleteOne()
          return
        }

        try {
          await message.reply(
            new MessageBuilder()
              .setContent(
                entries.filter(filter).random(giveaway.winners).join(""),
              )
              .setEmbeds((embed) => {
                return embed
                  .setColor("Primary")
                  .setAuthor({
                    iconURL: host.displayAvatarURL(),
                    name: `Hosted by ${host.displayName}`,
                  })
                  .setTitle(giveaway.prize)
                  .setDescription(`Congratulations, you won the giveaway!`)
                  .setFooter({ text: `ID: ${giveaway.id}` })
              }),
          )
        } catch (error) {
          console.error(
            `Failed to send giveaway message to channel ${message.channel.id} in guild ${message.guild.id}:`,
            error,
          )
        }

        await giveaway.updateOne({ $set: { expired: true } })
      } catch {
        giveaway.deleteOne()
      }
    }
  })
