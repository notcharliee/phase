import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/utils/schemas'


export default Utils.clientEvent({
  name: 'messageReactionRemove',
  async execute(client, reaction, user) {
    
    if (user.bot) return

    if (!reaction.message.guild || !reaction.message.guild.members) return

    const reactionRolesSchema = await Schemas.ReactionRoles.findOne({ message: reaction.message.id })
    if (!reactionRolesSchema) return

    for (const item of reactionRolesSchema.reactions) {
        
      if (item.emoji != reaction.emoji.id && item.emoji != reaction.emoji.name) continue

      const role = reaction.message.guild.roles.cache.get(item.role)
      const member = reaction.message.guild.members.cache.get(user.id)

      if (role && role.editable && member) member.roles.remove(role, 'Used Phase Reaction Role')

    }
    
  }
})