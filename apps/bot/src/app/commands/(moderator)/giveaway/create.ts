import { BotSubcommandBuilder } from "@phasejs/builders"

import ms from "ms"

import { db } from "~/lib/db"
import { Emojis } from "~/lib/emojis"
import { dateToTimestamp } from "~/lib/utils/formatting"

import { MessageBuilder } from "~/structures/builders/MessageBuilder"

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
    const host = interaction.member as GuildMember
    const expires = new Date(Date.now() + duration)

    await interaction.editReply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setAuthor({
            iconURL: host.displayAvatarURL(),
            name: `Hosted by ${host.displayName}`,
          })
          .setColor("Primary")
          .setTitle(`${prize}`)
          .setDescription(
            `
              React with ${Emojis.GiveawayReaction} to enter!
              Giveaway ends: ${dateToTimestamp(expires)}
            `,
          )
          .setFooter({ text: `ID: ${message.id}` })
      }),
    )

    await message.react(Emojis.GiveawayReaction)

    await db.giveaways.create({
      id: message.id,
      channel: message.channelId,
      created: message.createdTimestamp * 1000,
      host: host.id,
      winners,
      prize,
      duration,
      expires: expires.getTime(),
      expired: false,
    })
  })
