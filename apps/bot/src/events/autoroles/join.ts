import { botEvent } from "phasebot"
import { GuildSchema } from "@repo/schemas"
import { GuildFeature } from "discord.js"

export default botEvent("guildMemberAdd", async (client, member) => {
  if (
    member.guild.features.includes(GuildFeature.MemberVerificationGateEnabled)
  )
    return

  const guildSchema = await GuildSchema.findOne({ id: member.guild.id })
  const autoRolesModule = guildSchema?.modules?.AutoRoles
  
  if (!autoRolesModule?.enabled) return

  for (const role of autoRolesModule.roles) {
    if (member.guild.roles.cache.get(role) && !member.roles.cache.has(role))
      member.roles.add(role)
  }
})
