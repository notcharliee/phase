import * as Discord from 'discord.js'
import * as Utils from 'utils/.build/bot'
import * as Schemas from 'utils/.build/schemas'


export default Utils.Functions.clientEvent({
  name: 'voiceStateUpdate',
  async execute(client, oldVoice, newVoice) {

    const joinToCreateSchema = await Schemas.JoinToCreate.findOne({ guild: oldVoice.guild.id })

    if (!joinToCreateSchema) return
    if (!joinToCreateSchema.channel || joinToCreateSchema.channel == '0') return


    // If user was in channel before current channel and channel was a JTC subchannel and theres no members in it:

    if (oldVoice.channel && joinToCreateSchema.active.includes(oldVoice.channel.id) && (!oldVoice.channel.members.size || oldVoice.channel.members.every(member => member.user.bot))) {

      oldVoice.channel.delete(`@${newVoice.member?.displayName} left Phase's Join to Create voice channel ('${joinToCreateSchema.channel}') and there were no members left`)

      joinToCreateSchema.active.splice(joinToCreateSchema.active.indexOf(oldVoice.channel.id), 1)
      joinToCreateSchema.save()

    }


    // If current channel is main JTC channel:

    if (newVoice.channelId == joinToCreateSchema.channel) {

      const parent = joinToCreateSchema.category && joinToCreateSchema.category != '0' ? joinToCreateSchema.category : newVoice.channel?.parentId

      const newVoiceChannel = await newVoice.guild.channels.create({
        name: newVoice.member?.displayName || 'voice channel',
        type: Discord.ChannelType.GuildVoice,
        topic: `${newVoice.member?.displayName}'s voice channel - Created by Phase`,
        reason: `${newVoice.member?.displayName} joined Phase's Join to Create voice channel ('${joinToCreateSchema.channel}')`,
        parent,
      })


      // If bot has perms to move members:

      if ((await newVoice.guild.members.fetchMe()).permissions.has('MoveMembers')) {
        newVoice.setChannel(newVoiceChannel.id, `${newVoice.member?.displayName} joined Phase's Join to Create voice channel ('${joinToCreateSchema.channel}')`)
      }

      joinToCreateSchema.active.push(newVoiceChannel.id)
      joinToCreateSchema.save()

    }
    
  }
})