import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/schemas'


export default Utils.clientEvent({
  name: 'messageCreate',
  async execute(client, message) {
    if (!message.inGuild()) return

    const AFKSchema = await Schemas.AFKSchema.findOne({ user: message.author.id })

    if (AFKSchema) {
      await AFKSchema.deleteOne()

      message.reply({
        embeds: [
          new Discord.EmbedBuilder()
          .setColor(Utils.PhaseColour.Primary)
          .setDescription('Your AFK status has been updated to **false**.')
          .setTitle('AFK Status Changed')
        ],
      })
    } else {
      const mentionedMembers = message.mentions.users.map(user => user.id)
      if (!mentionedMembers) return

      for (const mentionedMember of mentionedMembers) {
        const mentionAFKSchema = await Schemas.AFKSchema.findOne({ user: mentionedMember })

        if (mentionAFKSchema) {
          const memberName = await message.guild.members.fetch(mentionedMember)

          message.reply({
            embeds: [
              new Discord.EmbedBuilder()
              .setColor(Utils.PhaseColour.Primary)
              .setDescription(mentionAFKSchema.reason)
              .setTitle(`${memberName.displayName} is currently AFK`)
            ],
          })
        }
      }
    }
  }
})