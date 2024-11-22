import { BotEventBuilder } from "@phasejs/core/builders"

import { ModuleId } from "@repo/utils/modules"

export default new BotEventBuilder()
  .setName("messageReactionRemove")
  .setExecute(async (client, reaction, user) => {
    if (user.bot || !reaction.message.inGuild()) return

    const guildDoc = client.stores.guilds.get(reaction.message.guildId)
    const moduleData = guildDoc?.modules?.[ModuleId.ReactionRoles]

    if (
      !moduleData?.enabled ||
      moduleData.channel !== reaction.message.channelId ||
      moduleData.message !== reaction.message.id
    ) {
      return
    }

    for (const moduleReaction of moduleData.reactions) {
      if (
        moduleReaction.emoji !== reaction.emoji.id &&
        moduleReaction.emoji !== reaction.emoji.name
      ) {
        continue
      }

      const role = reaction.message.guild.roles.cache.get(moduleReaction.role)

      const member =
        reaction.message.guild.members.cache.get(user.id) ??
        (await reaction.message.guild.members.fetch(user.id).catch(() => null))

      if (role && role.editable && member) {
        member.roles.remove(role).catch((error) => {
          console.error(
            `Failed to remove reaction role ${role.id} from member ${member.id} in guild ${reaction.message.guild!.id}:`,
            error,
          )
        })
      }
    }
  })
