import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientEvent({
  name: 'voiceStateUpdate',
  async execute(client, oldVoice, newVoice) {
    try {
      const guildSchema = await Schemas.GuildSchema.findOne({ id: oldVoice.guild.id })
      const joinToCreateModule = guildSchema?.modules.JoinToCreate
      if (!guildSchema || !joinToCreateModule?.enabled) return

      if ( // If...
        oldVoice.channel && // User was in a channel before update AND...
        joinToCreateModule.active.includes(oldVoice.channel.id) && // The channel was a jtc channel AND...
        (!oldVoice.channel.members.size || oldVoice.channel.members.every(member => member.user.bot)) // There's no members left OR the only members left are bots...
      ) { // Delete old jtc channel and update database.
        oldVoice.channel.delete()

        guildSchema.modules.JoinToCreate.active.splice(joinToCreateModule.active.indexOf(oldVoice.channel.id), 1)
        guildSchema.markModified("modules")
        guildSchema.save()
      }

      if ( // If...
        newVoice.channelId == joinToCreateModule.channel // New channel is the jtc base channel...
      ) { // Create new jtc channel, move member, and update database.
        const newVoiceChannel = await newVoice.guild.channels.create({
          name: newVoice.member?.displayName ?? "voice channel",
          type: Discord.ChannelType.GuildVoice,
          parent: joinToCreateModule.category,
        })

        newVoice.setChannel(newVoiceChannel)

        guildSchema.modules.JoinToCreate.active.push(newVoiceChannel.id)
        guildSchema.markModified("modules")
        guildSchema.save()
      }
    } catch (error) {
      throw error
    }
  }
})