import { botCommand, BotCommandBuilder } from "phase.js"
import { GameSchema } from "@repo/schemas"
import { PhaseEmoji, PhaseColour, memberNotFound } from "~/utils"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"

export default botCommand(
  new BotCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play tic-tac-toe against another user.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member you want to select.")
        .setRequired(true),
    ),
  async (client, interaction) => {
    const member = interaction.options.getUser("member")

    if (!member) return interaction.reply(memberNotFound())

    const message = await interaction.reply({
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("tictactoe.1")
            .setLabel(PhaseEmoji.ZeroWidthJoiner)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("tictactoe.2")
            .setLabel(PhaseEmoji.ZeroWidthJoiner)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("tictactoe.3")
            .setLabel(PhaseEmoji.ZeroWidthJoiner)
            .setStyle(ButtonStyle.Secondary),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("tictactoe.4")
            .setLabel(PhaseEmoji.ZeroWidthJoiner)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("tictactoe.5")
            .setLabel(PhaseEmoji.ZeroWidthJoiner)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("tictactoe.6")
            .setLabel(PhaseEmoji.ZeroWidthJoiner)
            .setStyle(ButtonStyle.Secondary),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("tictactoe.7")
            .setLabel(PhaseEmoji.ZeroWidthJoiner)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("tictactoe.8")
            .setLabel(PhaseEmoji.ZeroWidthJoiner)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("tictactoe.9")
            .setLabel(PhaseEmoji.ZeroWidthJoiner)
            .setStyle(ButtonStyle.Secondary),
        ),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setDescription(`${member} it's your go. Make a move!`)
          .setTitle("TicTacToe"),
      ],
      fetchReply: true,
    })

    new GameSchema({
      id: message.id,
      type: "TICTACTOE",
      game_data: {
        current_turn: {
          marker: PhaseEmoji.Cross,
          player: member.id,
        },
        moves: [
          PhaseEmoji.ZeroWidthJoiner,
          PhaseEmoji.ZeroWidthJoiner,
          PhaseEmoji.ZeroWidthJoiner,
          PhaseEmoji.ZeroWidthJoiner,
          PhaseEmoji.ZeroWidthJoiner,
          PhaseEmoji.ZeroWidthJoiner,
          PhaseEmoji.ZeroWidthJoiner,
          PhaseEmoji.ZeroWidthJoiner,
          PhaseEmoji.ZeroWidthJoiner,
        ],
      },
      players: [interaction.user.id, member.id],
    }).save()
  },
)
