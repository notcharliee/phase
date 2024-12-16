import { BotEventBuilder } from "@phasejs/builders"

import { ModuleId } from "@repo/utils/modules"

import { hasRequiredGuildPermissions, mapInvite } from "./_utils"

export default new BotEventBuilder()
  .setName("ready")
  .setListenerType("once")
  .setExecute(async (client) => {
    const guildDocs = client.stores.guilds.filter((guildDoc) => {
      const moduleConfig = guildDoc.modules?.[ModuleId.AuditLogs]
      return (moduleConfig?.enabled && moduleConfig.channels.invites) ?? false
    })

    for (const guild of client.guilds.cache.values()) {
      if (!guildDocs.has(guild.id)) continue
      if (!hasRequiredGuildPermissions(guild)) continue
      const invites = await guild.invites.fetch()
      client.stores.invites.set(guild.id, invites.mapValues(mapInvite))
    }
  })
