import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import dedent from "dedent"
import ms from "ms"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

import type { GuildMember } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("create")
  .setDescription("Creates a giveaway.")
  .addStringOption((option) =>
    option
      .setName("prize")
      .setDescription("What the winner will get.")
      .setRequired(true)
      .setMaxLength(200),
  )
  .addIntegerOption((option) =>
    option
      .setName("winners")
      .setDescription("How many members will win.")
      .setRequired(true)
      .setMaxValue(15),
  )
  .addStringOption((option) =>
    option
      .setName("duration")
      .setDescription("How long the giveaway will last (e.g. 1m, 1h, 1d).")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const message = await interaction.deferReply({ fetchReply: true })

    const prize = interaction.options.getString("prize", true)
    const winners = interaction.options.getInteger("winners", true)
    const duration = ms(interaction.options.getString("duration", true))
    const expires = message.createdAt.getTime() + duration
    const host = interaction.member as GuildMember

    void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            iconURL: host.displayAvatarURL(),
            name: `Hosted by ${host.displayName}`,
          })
          .setColor(PhaseColour.Primary)
          .setTitle(`${prize}`)
          .setDescription(
            dedent`
              React with 🎉 to enter!
              Giveaway ends: <t:${Math.floor(expires / 1000)}:R>
            `,
          )
          .setFooter({ text: `ID: ${message.id}` }),
      ],
    })

    void message.react("🎉")

    void db.giveaways.create({
      id: message.id,
      channel: message.channelId,
      created: message.createdTimestamp * 1000,
      host: host.id,
      winners,
      prize,
      duration,
      expires,
      expired: false,
    })
  })
