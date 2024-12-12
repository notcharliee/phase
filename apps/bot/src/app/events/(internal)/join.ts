import { BotEventBuilder } from "@phasejs/core/builders"

import { alertWebhook } from "~/lib/clients/webhooks/alert"
import { db } from "~/lib/db"

import { MessageBuilder } from "~/structures/builders"

export default new BotEventBuilder()
  .setName("guildCreate")
  .setExecute(async (client, guild) => {
    const guildId = guild.id
    const ownerId = guild.ownerId
    const owner = await guild.fetchOwner().catch(() => null)

    const blacklist = client.stores.config.blacklist

    const guildIsBlacklisted = blacklist.guilds.find(({ id }) => guildId === id)
    const userIsBlacklisted = blacklist.users.find(({ id }) => ownerId === id)

    if (guildIsBlacklisted || userIsBlacklisted) {
      await guild.leave()

      const blacklistEntry = guildIsBlacklisted ?? userIsBlacklisted!
      const blacklistType = guildIsBlacklisted ? "guild" : "user"

      const alertMessage = new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Destructive")
          .setTitle("Server join prevented")
          .setFooter({ text: "Guild ID: " + guild.id })
          .setDescription(
            `
              The bot was blocked from joining a server because its ${blacklistType === "user" ? "owner" : "ID"} was found on the ${blacklistType} blacklist.

              **Blacklisted ${blacklistType}:**
              ${blacklistEntry.id}

              **Reason for blacklist:**
              ${blacklistEntry.reason ?? "No reason provided"}
            `,
          )
      })

      await alertWebhook.send(alertMessage)
    } else {
      const ownedGuildsCount = client.guilds.cache.filter(
        (g) => ownerId === g.ownerId,
      ).size

      const alertMessage = new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("Bot was added")
          .setThumbnail(guild.iconURL())
          .setTimestamp()
          .setDescription(
            `
              **Name:** \`${guild.name}\`
              **Created:** <t:${Math.floor(guild.createdAt.getTime() / 1000)}:R>
              **Membercount:** \`${guild.memberCount}\`
              **ID:** \`${guild.id}\`

              **Owner Name:** \`${owner?.user.username ?? "unknown"}\`
              **Owner ID:** \`${ownerId}\`
              **Owned Phase Servers:** \`${ownedGuildsCount}\`
            `,
          )
      })

      await alertWebhook.send(alertMessage)
      await db.guilds.create({ id: guildId, admins: [ownerId] })
    }
  })
