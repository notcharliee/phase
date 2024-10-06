import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { db } from "~/lib/db"
import { Emojis } from "~/lib/emojis"
import { PhaseColour } from "~/lib/enums"

import { BotErrorMessage } from "~/structures/BotError"

import type { GuildMember, GuildTextBasedChannel } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("reroll")
  .setDescription("Rerolls a giveaway.")
  .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("The ID of the giveaway.")
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("How many winners you want to reroll.")
      .setRequired(false),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply({
      ephemeral: true,
    })

    const id = interaction.options.getString("id", true)

    const giveaway = await db.giveaways.findOne({
      guild: interaction.guildId,
      created: id,
      expired: true,
    })

    if (!giveaway) {
      void interaction.editReply(
        new BotErrorMessage(
          "No giveaway exists with that ID. Make sure you typed it in correctly and try again.",
        ).toJSON(),
      )

      return
    }

    const amount =
      interaction.options.getInteger("amount", false) ?? giveaway.winners

    const giveawayChannel = interaction.client.channels.cache.get(
      giveaway.channel,
    ) as GuildTextBasedChannel | undefined

    if (!giveawayChannel) {
      const commandMention = `</giveaway delete:${interaction.id}>`

      void interaction.editReply(
        new BotErrorMessage(
          `The channel this giveaway was in no longer exists, so no message data can be retrieved. You can delete the giveaway using the ${commandMention} command.`,
        ).toJSON(),
      )

      return
    }

    const giveawayMessage = await giveawayChannel.messages
      .fetch(giveaway.id as string)
      .catch(() => null)

    if (!giveawayMessage) {
      const commandMention = `</giveaway delete:${interaction.id}>`

      void interaction.editReply(
        new BotErrorMessage(
          `The message this giveaway was in no longer exists, so no data can be retrieved. You can delete the giveaway using the ${commandMention} command.`,
        ).toJSON(),
      )

      return
    }

    const giveawayReaction = giveawayMessage.reactions.cache.get(
      Emojis.Giveaway_Reaction,
    )

    if (!giveawayReaction) {
      void interaction.editReply(
        new BotErrorMessage(
          `The \`${Emojis.Giveaway_Reaction}\` reaction was not found in the giveaway message, which is required to track the giveaway entries and subsequently reroll the winners.`,
        ).toJSON(),
      )

      return
    }

    if (amount > giveawayReaction.count - 1) {
      void interaction.editReply(
        new BotErrorMessage(
          "You cannot reroll more winners than there are members entered in the giveaway.",
        ).toJSON(),
      )

      return
    }

    const giveawayEntries = await giveawayReaction.users.fetch()
    giveawayEntries.delete(interaction.client.user.id)

    const newWinners = giveawayEntries.random(amount)

    const host = (await interaction.guild?.members
      .fetch(giveaway.host)
      .catch(() => interaction.member)) as GuildMember

    void giveawayMessage.reply({
      content: newWinners.join(""),
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setAuthor({
            iconURL: host.displayAvatarURL(),
            name: `Hosted by ${host.displayName}`,
          })
          .setTitle(giveaway.prize)
          .setDescription("Congratulations, you have won the giveaway!")
          .setFooter({
            text: `ID: ${giveaway.id}`,
          }),
      ],
    })

    void interaction.editReply("The giveaway has been rerolled.")
  })
