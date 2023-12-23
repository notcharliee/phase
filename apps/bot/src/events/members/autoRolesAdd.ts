import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientEvent({
  name: 'guildMemberAdd',
  async execute(client, member) {
    if (member.guild.features.includes(Discord.GuildFeature.MemberVerificationGateEnabled)) return

    const guildSchema = await Schemas.GuildSchema.findOne({ id: member.guild.id })
    const autoRolesModule = guildSchema?.modules.AutoRole
    if (!autoRolesModule?.enabled) return

    for (const role of autoRolesModule.roles) {
      if (member.guild.roles.cache.get(role) && !member.roles.cache.has(role))
        member.roles.add(role)
    }
  }
})