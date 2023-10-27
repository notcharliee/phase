import * as Discord from 'discord.js'
import * as Utils from 'utils/.build/bot'
import * as Schemas from 'utils/.build/schemas'


export default Utils.Functions.clientEvent({
  name: 'messageCreate',
  async execute(client, message) {
    
    if (!client.user) return
    if (!message.guild) return

    const AFKsSchema = await Schemas.AFKs.findOne({ guild: message.guildId, user: message.author.id })

    if (AFKsSchema) {

      await AFKsSchema.deleteOne()

      message.reply({
        embeds: [
          new Discord.EmbedBuilder()
          .setColor(Utils.Enums.PhaseColour.Primary)
          .setDescription('Your AFK status has been updated to **false**.')
          .setTitle('AFK Status Changed')
        ],
      })

    } else {

      const mentionedMembers = message.mentions.users.map(usr => usr.id)

      if (!mentionedMembers) return

      for (const mentionedMember of mentionedMembers) {

        const mentionSchema = await Schemas.AFKs.findOne({ guild: message.guild.id, user: mentionedMember })
        const memberName = await message.guild.members.fetch(mentionedMember)

        if (mentionSchema) message.reply({
          embeds: [
            new Discord.EmbedBuilder()
            .setColor(Utils.Enums.PhaseColour.Primary)
            .setDescription(mentionSchema.reason)
            .setTitle(`${memberName.displayName} is currently AFK`)
          ],
        })

      }

    }
    
  }
})