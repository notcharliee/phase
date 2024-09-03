import { GuildFeature } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"

export default botEvent(
  "guildMemberUpdate",
  async (_, oldMember, newMember) => {
    if (
      !newMember.guild.features.includes(
        GuildFeature.MemberVerificationGateEnabled,
      ) ||
      !oldMember.pending ||
      (oldMember.pending && newMember.pending)
    )
      return

    const guildDoc = await cache.guilds.get(newMember.guild.id)
    const autoRolesModule = guildDoc?.modules?.[ModuleId.AutoRoles]

    if (!autoRolesModule?.enabled) return

    for (const stringOrObject of autoRolesModule.roles) {
      const role =
        typeof stringOrObject === "string" ? stringOrObject : stringOrObject.id

      if (
        newMember.guild.roles.cache.get(role) &&
        !newMember.roles.cache.has(role)
      )
        newMember.roles.add(role)
    }
  },
)
