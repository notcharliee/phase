import { GuildEmoji } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { parseHiddenContent } from "~/lib/utils"

export default new BotEventBuilder()
  .setName("messageReactionAdd")
  .setExecute(async (client, reaction, user) => {
    if (!reaction.message.inGuild()) return
    if (reaction.message.author.id !== client.user!.id) return

    const guildDoc = client.store.guilds.get(reaction.message.guildId)
    const moduleData = guildDoc?.modules?.[ModuleId.SelfRoles]

    if (!moduleData?.enabled) return

    const messageId = parseHiddenContent(reaction.message.content)
    const message = moduleData.messages.find(({ id }) => id === messageId)

    const method = message?.methods.find(
      (method) =>
        method.type === "reaction" &&
        method.emoji ===
          (reaction.emoji instanceof GuildEmoji
            ? reaction.emoji.id
            : reaction.emoji.name),
    )

    if (!message || !method) return

    const member =
      reaction.message.guild.members.cache.get(user.id) ??
      (await reaction.message.guild.members.fetch(user.id).catch(() => null))

    if (!member) return

    const roles = "roles" in method ? method.roles : []

    const rolesToAdd = roles.filter(({ action }) => action === "add")
    const rolesToRemove = roles.filter(({ action }) => action === "remove")

    if (rolesToAdd.length) {
      member.roles.add(rolesToAdd.map(({ id }) => id)).catch(() => null)
    }

    if (rolesToRemove.length) {
      member.roles.remove(rolesToRemove.map(({ id }) => id)).catch(() => null)
    }
  })
