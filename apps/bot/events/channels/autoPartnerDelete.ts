import * as Discord from 'discord.js'
import * as Utils from 'phaseutils'


export default Utils.Functions.clientEvent({
  name: 'channelDelete',
  async execute(client, channel) {
    
    const guildAutoPartnerSchema = await Utils.Schemas.AutoPartners.findOne({ guild: (channel as Discord.NonThreadGuildBasedChannel).guildId }) // The partnership schema of the current guild.
    const partnerAutoPartnerSchemas = await Utils.Schemas.AutoPartners.find({ partners: { $elemMatch: { channelId: channel.id } } }) // Any partnership schemas that had the guild as a partner.

    if (!guildAutoPartnerSchema || !partnerAutoPartnerSchemas.length) return // If no partnership schema for the current guild or current guild has no partners, return.

    for (const partnerAutoPartnerSchema of partnerAutoPartnerSchemas) { // For each partnered guild:

      const guildAutoPartnerIndex = guildAutoPartnerSchema?.partners.findIndex(partner => partner.channelId == partnerAutoPartnerSchema.channel) // Index of other guild's partner object in current guild's array.
      const partnerAutoPartnerIndex = partnerAutoPartnerSchema.partners.findIndex(partner => partner.channelId == channel.id) // Index of current guild's partner object in partnered guild's array.

      try { // Try the following code:

        const partnerAutoPartnerChannel = client.channels.cache.get(partnerAutoPartnerSchema.channel!) as Discord.TextChannel | undefined // Get partnership channel of partnered guild
        const guildAutoPartnerAdvertMessageId = partnerAutoPartnerSchema.partners.find(partner => partner.guildId == guildAutoPartnerSchema.guild)!.messageId // Find message id of current guild's advert in partnered guild.

        await partnerAutoPartnerChannel?.messages.delete(guildAutoPartnerAdvertMessageId) // Delete current guild's advert from partnered guild's partnership channel. 

      } catch { // If there's an error:

        return

      }

      guildAutoPartnerSchema.partners.splice(partnerAutoPartnerIndex, 1) // Remove partnered guild's object from current guild's partners array.
      await guildAutoPartnerSchema.save() // Save current guild's schema's changes.

      partnerAutoPartnerSchema.partners.splice(guildAutoPartnerIndex, 1) // Remove current guild's object from partnered guild's partners array.
      await partnerAutoPartnerSchema.save() // Save partnered guild's schema's changes.

    }
    
  }
})