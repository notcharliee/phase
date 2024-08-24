import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"

export default new BotEventBuilder()
  .setName("messageReactionAdd")
  .setExecute(async (_, reaction, user) => {
    if (user.bot || !reaction.message.inGuild()) return

    const guildDoc = await cache.guilds.get(reaction.message.guildId)
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
        member.roles.add(role).catch((error) => {
          console.error(
            `Failed to add reaction role ${role.id} to member ${member.id} in guild ${reaction.message.guild!.id}:`,
            error,
          )
        })
      }
    }
  })
