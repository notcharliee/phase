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

export default new BotEventBuilder()
  .setName("guildCreate")
  .setExecute(async (_, guild) => {
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
          .setTimestamp()
          .setDescription(
            dedent`
              **Name:** \`${guild.name}\`
              **Created:** <t:${Math.floor(guild.createdAt.getTime() / 1000)}:R>
              **Membercount:** \`${guild.memberCount}\`
              **ID:** \`${guild.id}\`

              **Owner Name:** \`${owner.user.username}\`
              **Owner ID:** \`${owner.user.id}\`
              **Owned Phase Servers:** \`${ownedGuildsCount}\`
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
