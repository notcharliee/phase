import { botEvent } from "phasebot"

import { db } from "~/lib/db"

export default botEvent("messageReactionAdd", async (_, reaction, user) => {
  if (user.bot || !reaction.message.inGuild()) return

  const guildSchema = await db.guilds.findOne({
    id: reaction.message.guildId,
  })

  const reactionRolesModule = guildSchema?.modules?.ReactionRoles

  if (
    !reactionRolesModule?.enabled ||
    reactionRolesModule.channel !== reaction.message.channelId ||
    reactionRolesModule.message !== reaction.message.id
  ) {
    return
  }

  for (const reactionRoleReaction of reactionRolesModule.reactions) {
    if (
      reactionRoleReaction.emoji !== reaction.emoji.id &&
      reactionRoleReaction.emoji !== reaction.emoji.name
    ) {
      continue
    }

    const role = reaction.message.guild.roles.cache.get(
      reactionRoleReaction.role,
    )
    const member = reaction.message.guild.members.cache.get(user.id)

    if (role && role.editable && member) {
      member.roles.add(role)
    }
  }
})
