import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/schemas'


export default Utils.clientEvent({
  name: 'guildMemberUpdate',
  async execute(client, oldMember, newMember) {
    if ( // If...
      !newMember.guild.features.includes(Discord.GuildFeature.MemberVerificationGateEnabled) || // No verification gate OR...
      !oldMember.pending || // Old member isnt pending OR...
      (oldMember.pending && newMember.pending) // Old member AND new member are both pending...
    ) return // Return early

    const guildSchema = await Schemas.GuildSchema.findOne({ id: newMember.guild.id })
    const autoRolesModule = guildSchema?.modules.AutoRoles
    if (!autoRolesModule?.enabled) return

    for (const role of autoRolesModule.roles) {
      if (newMember.guild.roles.cache.get(role) && !newMember.roles.cache.has(role))
        newMember.roles.add(role)
    }
  }
})