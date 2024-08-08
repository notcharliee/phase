import { GuildFeature } from "discord.js"
import { botEvent } from "phasebot"

import { db } from "~/lib/db"

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

    const guildSchema = await db.guilds.findOne({ id: newMember.guild.id })
    const autoRolesModule = guildSchema?.modules?.AutoRoles

    if (!autoRolesModule?.enabled) return

    for (const role of autoRolesModule.roles) {
      if (
        newMember.guild.roles.cache.get(role) &&
        !newMember.roles.cache.has(role)
      )
        newMember.roles.add(role)
    }
  },
)
