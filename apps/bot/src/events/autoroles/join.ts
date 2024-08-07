import { GuildFeature } from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { db } from "~/lib/db"

export default botEvent("guildMemberAdd", async (_, member) => {
  if (
    member.guild.features.includes(GuildFeature.MemberVerificationGateEnabled)
  )
    return

  const guildSchema = await db.guilds.findOne({ id: member.guild.id })
  const autoRolesModule = guildSchema?.modules?.[ModuleId.AutoRoles]

  if (!autoRolesModule?.enabled) return

  for (const role of autoRolesModule.roles) {
    if (member.guild.roles.cache.get(role) && !member.roles.cache.has(role))
      member.roles.add(role)
  }
})
