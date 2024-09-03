import { GuildFeature } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"

export default botEvent("guildMemberAdd", async (_, member) => {
  if (
    member.guild.features.includes(GuildFeature.MemberVerificationGateEnabled)
  )
    return

  const guildDoc = await cache.guilds.get(member.guild.id)
  const autoRolesModule = guildDoc?.modules?.[ModuleId.AutoRoles]

  if (!autoRolesModule?.enabled) return

  for (const stringOrObject of autoRolesModule.roles) {
    const role =
      typeof stringOrObject === "string" ? stringOrObject : stringOrObject.id

    if (member.guild.roles.cache.get(role) && !member.roles.cache.has(role))
      member.roles.add(role)
  }
})
