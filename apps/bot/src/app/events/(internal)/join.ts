import { EmbedBuilder } from "discord.js"
import { BotEventBuilder } from "@phasejs/core/builders"

import dedent from "dedent"

import { alertWebhook } from "~/lib/clients/webhooks/alert"
import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

export default new BotEventBuilder()
  .setName("guildCreate")
  .setExecute(async (client, newGuild) => {
    const owner = await newGuild.fetchOwner().catch(console.error)

    const guildIsBlacklisted = client.stores.config.blacklist.guilds.find(
      (guild) => guild.id === newGuild.id,
    )

    const userIsBlacklisted = client.stores.config.blacklist.users.find(
      (user) => user.id === newGuild.ownerId,
    )

    if (guildIsBlacklisted || userIsBlacklisted) {
      await newGuild.leave().catch(console.error)

      const blacklistEntry = guildIsBlacklisted ?? userIsBlacklisted!
      const blacklistType = guildIsBlacklisted ? "guild" : "user"

      alertWebhook
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("Server join prevented")
              .setFooter({ text: "Guild ID: " + newGuild.id })
              .setDescription(
                dedent`
                The bot was blocked from joining a server because its ${blacklistType === "user" ? "owner" : "ID"} was found on the ${blacklistType} blacklist.

                **Blacklisted ${blacklistType}:**
                ${blacklistEntry.id}

                **Reason for blacklist:**
                ${blacklistEntry.reason ?? "No reason provided"}
              `,
              ),
          ],
        })
        .catch(console.error)
    } else {
      const ownedGuildsCount = owner
        ? (await db.guilds.countDocuments({
            "admins.0": owner.id,
          })) + 1
        : undefined

      alertWebhook
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setTitle("Bot was added")
              .setThumbnail(newGuild.iconURL())
              .setTimestamp()
              .setDescription(
                dedent`
                **Name:** \`${newGuild.name}\`
                **Created:** <t:${Math.floor(newGuild.createdAt.getTime() / 1000)}:R>
                **Membercount:** \`${newGuild.memberCount}\`
                **ID:** \`${newGuild.id}\`

                **Owner Name:** \`${owner?.user.username ?? "unknown"}\`
                **Owner ID:** \`${owner?.user.id ?? "unknown"}\`
                **Owned Phase Servers:** \`${ownedGuildsCount ?? "unknown"}\`
            `,
              ),
          ],
        })
        .catch(console.error)

      db.guilds
        .create({ id: newGuild.id, admins: [newGuild.ownerId] })
        .catch(console.error)
    }
  })
