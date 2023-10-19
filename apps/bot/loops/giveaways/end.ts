import * as Discord from 'discord.js'
import * as Utils from 'utils'


export default Utils.Functions.clientLoop({
  name: 'giveaways',
  interval: 1000 * 5, // 5 seconds
  async execute(client) {

    const expiredGiveawaySchemas = await Utils.Schemas.Giveaways.find({ expires: { $lt: Date.now() }, expired: false })

    for (const giveawaySchema of expiredGiveawaySchemas) {

      const giveawayPrize = giveawaySchema.prize
      const giveawayWinners = giveawaySchema.winners

      const giveawayChannel = client.channels.cache.get(giveawaySchema.channel) as Discord.GuildTextBasedChannel | undefined

      if (!giveawayChannel) return giveawaySchema.deleteOne()

      try {

        const giveawayMessage = await giveawayChannel.messages.fetch(giveawaySchema.message)
        const giveawayHost = await giveawayChannel.guild.members.fetch(giveawaySchema.host)

        const giveawayReaction = giveawayMessage.reactions.cache.get(Utils.Enums.PhaseEmoji.Tada.split(':')[2].replace('>', ''))

        if (!giveawayReaction) {
          await giveawayMessage.delete()
          await giveawaySchema.deleteOne()

          return
        }

        const giveawayEntries = (await giveawayReaction.users.fetch()).map(user => user)

        giveawayEntries.splice(giveawayEntries.findIndex(user => user.id == client.user.id), 1)

        if (!giveawayEntries.length) {
          await giveawayMessage.delete()
          await giveawaySchema.deleteOne()

          return
        }

        giveawayMessage.reply({
          content: Utils.Functions.getRandomArrayElements(giveawayEntries, giveawayWinners).join(''),
          embeds: [
            new Discord.EmbedBuilder()
            .setAuthor({ iconURL: giveawayHost.displayAvatarURL(), name: `Hosted by ${giveawayHost.displayName}` })
            .setColor(Utils.Enums.PhaseColour.Primary)
            .setDescription(`Congratulations, you have won the giveaway!`)
          ],
        })

        giveawaySchema.expired = true
        await giveawaySchema.save()

      } catch {

        await giveawaySchema.deleteOne()

      }

    }
    
  }
})