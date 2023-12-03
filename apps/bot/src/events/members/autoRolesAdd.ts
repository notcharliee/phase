import * as Discord from 'discord.js'
import * as Utils from '@repo/utils/bot'
import * as Schemas from '@repo/utils/schemas'


export default Utils.Functions.clientEvent({
  name: 'guildMemberAdd',
  async execute(client, member) {

    if (member.guild.features.includes(Discord.GuildFeature.MemberVerificationGateEnabled)) return
    
    const autoRolesSchema = await Schemas.AutoRoles.findOne({ guild: member.guild.id })
    if (!autoRolesSchema) return

    for (const role of autoRolesSchema.roles) {

      if (member.guild.roles.cache.get(role)) member.roles.add(role)
      .catch(() => { return })

    }
    
  }
})