import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientEvent({
  name: 'guildMemberUpdate',
  async execute(client, oldMember, newMember) {

    if (
      !oldMember.pending ||
      !oldMember.pending && !newMember.pending ||
      !newMember.guild.features.includes(Discord.GuildFeature.MemberVerificationGateEnabled)
    ) return
    
    const autoRolesSchema = await Schemas.AutoRoles.findOne({ guild: newMember.guild.id })
    if (!autoRolesSchema) return

    for (const role of autoRolesSchema.roles) {

      if (newMember.guild.roles.cache.get(role)) newMember.roles.add(role)
      .catch(() => { return })

    }
    
  }
})