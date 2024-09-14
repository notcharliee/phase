import { GuildFeature } from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"

const verificationGate = GuildFeature.MemberVerificationGateEnabled

export default new BotEventBuilder()
  .setName("guildMemberAdd")
  .setExecute(async (_, member) => {
    if (member.guild.features.includes(verificationGate)) return

    const guildDoc = await cache.guilds.get(member.guild.id)
    const autoRolesModule = guildDoc?.modules?.[ModuleId.AutoRoles]

    if (!autoRolesModule?.enabled) return

    for (const role of autoRolesModule.roles) {
      if (role.target === "bots" && !member.user.bot) continue
      if (role.target === "members" && member.user.bot) continue

      if (
        member.guild.roles.cache.get(role.id) &&
        !member.roles.cache.has(role.id)
      ) {
        member.roles.add(role.id)
      }
    }
  })
