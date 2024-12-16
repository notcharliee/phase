import { BotCronBuilder } from "@phasejs/builders"

import { ModuleId } from "@repo/utils/modules"

import {
  hasRequiredGuildPermissions,
  mapInvite,
} from "~/app/events/(modules)/invite-logs/_utils"

export default new BotCronBuilder()
  .setPattern("* * * * *")
  .setExecute(async (client) => {
    for (const guild of client.guilds.cache.values()) {
      const hasInvitesInStore = client.stores.invites.has(guild.id)

      if (!hasRequiredGuildPermissions(guild)) {
        if (hasInvitesInStore) client.stores.invites.delete(guild.id)
        continue
      }

      const guildDoc = client.stores.guilds.get(guild.id)

      if (!guildDoc) {
        if (hasInvitesInStore) client.stores.invites.delete(guild.id)
        continue
      }

      const moduleConfig = guildDoc.modules?.[ModuleId.AuditLogs]

      if (!moduleConfig?.enabled || !moduleConfig.channels.invites) {
        if (hasInvitesInStore) client.stores.invites.delete(guild.id)
        continue
      }

      if (hasInvitesInStore) continue

      const invites = await guild.invites.fetch()
      client.stores.invites.set(guild.id, invites.mapValues(mapInvite))
    }
  })
