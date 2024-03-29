import { GuildSchema } from "@repo/schemas"
import { botEvent } from "phasebot"

export default botEvent(
  "messageReactionRemove",
  async (client, reaction, user) => {
    if (user.bot || !reaction.message.inGuild()) return

    const guildSchema = await GuildSchema.findOne({
      id: reaction.message.guildId,
    })
    const reactionRolesModule = guildSchema?.modules?.ReactionRoles
    
    if (!reactionRolesModule?.enabled) return

    for (const reactionRoleReaction of reactionRolesModule.reactions) {
      if (
        reactionRoleReaction.emoji !== reaction.emoji.id &&
        reactionRoleReaction.emoji !== reaction.emoji.name
      )
        continue

      const role = reaction.message.guild.roles.cache.get(
        reactionRoleReaction.role,
      )
      const member = reaction.message.guild.members.cache.get(user.id)

      if (role && role.editable && member) {
        member.roles.remove(role)
      }
    }
  },
)
