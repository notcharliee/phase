import { EmbedBuilder, GuildTextBasedChannel, User } from "discord.js"
import { BotCronBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default new BotCronBuilder()
  .setPattern("*/5 * * * * *")
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
        const message = await channel.messages.fetch(giveaway.id)
        const host = await channel.guild.members.fetch(giveaway.host)
        const entries = await message.reactions.cache.get("🎉")?.users.fetch()

        const filter = (user: User) => user.id !== client.user.id

        if (!entries || !entries.filter(filter).size) {
          await message.delete()
          await giveaway.deleteOne()
          return
        }

        message.reply({
          content: entries.filter(filter).random(giveaway.winners).join(""),
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                iconURL: host.displayAvatarURL(),
                name: `Hosted by ${host.displayName}`,
              })
              .setTitle(giveaway.prize)
              .setDescription(`Congratulations, you won the giveaway!`)
              .setColor(PhaseColour.Primary)
              .setFooter({
                text: `ID: ${giveaway.id}`,
              }),
          ],
        })

        giveaway.expired = true

        await giveaway.save()
      } catch {
        await giveaway.deleteOne()
      }
    }
  })
