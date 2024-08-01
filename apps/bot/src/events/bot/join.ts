import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import dedent from "dedent"

import { alertWebhook } from "~/lib/clients/webhooks/alert"
import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"
import { getOrdinal } from "~/lib/utils"

export default new BotEventBuilder()
  .setName("guildCreate")
  .setExecute(async (client, guild) => {
    const owner = await guild.fetchOwner()

    const ownedGuildsCount =
      (await db.guilds.countDocuments({
        "admins.0": owner.id,
      })) + 1

    void alertWebhook.send({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("New Server")
          .setThumbnail(guild.iconURL())
          .setDescription(
            dedent`
              **${guild.name}** \`(${guild.id})\` was created <t:${Math.floor(guild.createdAt.getTime() / 1000)}:R> by **${owner.user.username}** \`(${owner.user.id})\` and currently has **${guild.memberCount}** members.

              This is the **${getOrdinal(ownedGuildsCount)}** server that **${owner.user.username}** has added Phase to, increasing the total server count to **${client.application!.approximateGuildCount}**.
            `,
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`phase.guilds.${guild.id}.remove_bot`)
            .setLabel("Remove Bot"),
        ),
      ],
    })

    void db.guilds.create({
      id: guild.id,
      admins: [guild.ownerId],
    })
  })
