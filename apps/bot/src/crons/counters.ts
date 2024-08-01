import { BaseGuildVoiceChannel } from "discord.js"
import { BotCronBuilder } from "phasebot/builders"

import { db } from "~/lib/db"

export default new BotCronBuilder()
  .setPattern("*/10 * * * *")
  .setExecute(async (client) => {
    const guildDocs = await db.guilds.find({
      "modules.Counters.enabled": true,
    })

    for (const guildDoc of guildDocs) {
      const guild =
        client.guilds.cache.get(guildDoc.id) ??
        (await client.guilds.fetch({
          guild: guildDoc.id,
          cache: true,
          withCounts: true,
        }))

      for (const counter of guildDoc.modules!.Counters!.counters) {
        const channel = (guild.channels.cache.get(counter.channel) ??
          (await client.channels.fetch(counter.channel))) as
          | BaseGuildVoiceChannel
          | undefined

        if (!channel) continue

        const memberCount = guild.memberCount
        const onlineMemberCount = guild.approximatePresenceCount ?? 0
        const offlineMemberCount = memberCount - onlineMemberCount

        const newName = counter.content
          .replaceAll("{memberCount}", memberCount + "")
          .replaceAll("{onlineMemberCount}", onlineMemberCount + "")
          .replaceAll("{offlineMemberCount}", offlineMemberCount + "")

        if (newName === channel.name) continue

        void channel.edit({ name: newName }).catch((e) => console.error(e))
      }
    }
  })
