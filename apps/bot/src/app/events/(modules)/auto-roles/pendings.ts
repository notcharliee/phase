import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"

export default new BotEventBuilder()
  .setName("guildMemberUpdate")
  .setExecute(async (client, oldMember, newMember) => {
    if (!oldMember.pending || (oldMember.pending && newMember.pending)) return

    const guildDoc = client.store.guilds.get(newMember.guild.id)
    const autoRolesModule = guildDoc?.modules?.[ModuleId.AutoRoles]

    if (!autoRolesModule?.enabled) return

    for (const role of autoRolesModule.roles) {
      if (role.target === "bots" && !newMember.user.bot) continue
      if (role.target === "members" && newMember.user.bot) continue

      if (
        newMember.guild.roles.cache.get(role.id) &&
        !newMember.roles.cache.has(role.id)
      ) {
        await newMember.roles.add(role.id).catch(() => null)
      }
    }
  })
