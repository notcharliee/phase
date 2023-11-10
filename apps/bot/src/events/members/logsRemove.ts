import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'


export default Utils.Functions.clientEvent({
  name: 'guildMemberRemove',
  async execute(client, member) {
    
    const auditLogsSchema = await Schemas.AuditLogs.findOne({ guild: member.guild.id })
    if (!auditLogsSchema) return
    
    const channelId = auditLogsSchema.channel

    const channel = client.channels.cache.get(channelId) as Discord.GuildTextBasedChannel | undefined

    return channel?.send({
      embeds: [
        new Discord.EmbedBuilder()
        .setAuthor({ iconURL: member.displayAvatarURL(), name: member.displayName })
        .setColor(Utils.Enums.PhaseColour.Primary)
        .setDescription(`User: ${member}\nJoined: ${member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : '`Unknown`'}`)
        .setFooter({ text: `ID: ${member.id}` })
        .setTitle('Member Left')
      ],
    })
    
  }
})