import { botCronJob } from "phase.js"
import { getRandomArrayElements, PhaseColour, PhaseEmoji } from "~/utils"
import { GiveawaySchema } from "@repo/schemas"
import { GuildTextBasedChannel, EmbedBuilder } from "discord.js"

export default botCronJob("*/10 * * * * *", async (client) => {
  const expiredGiveawaySchemas = await GiveawaySchema.find({
    expires: { $lt: Date.now() },
    expired: false,
  })

  for (const giveawaySchema of expiredGiveawaySchemas) {
    const giveawayWinners = giveawaySchema.winners

    const giveawayChannel = client.channels.cache.get(
      giveawaySchema.channel,
    ) as GuildTextBasedChannel | undefined

    if (!giveawayChannel) return giveawaySchema.deleteOne()

    try {
      const giveawayMessage = await giveawayChannel.messages.fetch(
        giveawaySchema.id,
      )
      const giveawayHost = await giveawayChannel.guild.members.fetch(
        giveawaySchema.host,
      )

      const giveawayReaction = giveawayMessage.reactions.cache.get(
        PhaseEmoji.Tada.split(":")[2].replace(">", ""),
      )

      if (!giveawayReaction) {
        await giveawayMessage.delete()
        await giveawaySchema.deleteOne()

        return
      }

      const giveawayEntries = (await giveawayReaction.users.fetch()).map(
        (user) => user,
      )

      giveawayEntries.splice(
        giveawayEntries.findIndex((user) => user.id == client.user.id),
        1,
      )

      if (!giveawayEntries.length) {
        await giveawayMessage.delete()
        await giveawaySchema.deleteOne()

        return
      }

      giveawayMessage.reply({
        content: getRandomArrayElements(giveawayEntries, giveawayWinners).join(
          "",
        ),
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              iconURL: giveawayHost.displayAvatarURL(),
              name: `Hosted by ${giveawayHost.displayName}`,
            })
            .setColor(PhaseColour.Primary)
            .setDescription(`Congratulations, you have won the giveaway!`),
        ],
      })

      giveawaySchema.expired = true
      await giveawaySchema.save()
    } catch {
      await giveawaySchema.deleteOne()
    }
  }
})
