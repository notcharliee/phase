import { botEvent } from "phasebot"
import { GameSchema } from "@repo/schemas"
import { errorMessage, PhaseError, PhaseColour, ZeroWidthJoiner } from "~/utils"
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"

export default botEvent("interactionCreate", async (client, interaction) => {
  if (interaction.isButton() && /tictactoe\.\d/.test(interaction.customId)) {
    const buttonIndex = Number(interaction.customId.split(".")[1]) - 1
    const gameSchema = await GameSchema.findOne({
      id: interaction.message.id,
      type: "TICTACTOE",
    })

    // If no schema, return unknown error.

    if (!gameSchema) {
      return interaction.reply(
        errorMessage({
          title: "Something went wrong",
          description: PhaseError.Unknown,
        }),
      )
    }

    // If user is not in game, return access denied error.

    if (!gameSchema.players.includes(interaction.user.id)) {
      return interaction.reply(
        errorMessage({
          title: "Access Denied",
          description: `You are not a member of this game. To start a new game, run \`/tictactoe\`.`,
          ephemeral: true,
        }),
      )
    }

    // If user is not current turn, return no can do error.

    const currentTurn = gameSchema.game_data.current_turn
    const moves = gameSchema.game_data.moves

    if (currentTurn.player != interaction.user.id) {
      return interaction.reply(
        errorMessage({
          title: "Be patient!",
          description: "Please wait your turn.",
          ephemeral: true,
        }),
      )
    }

    // If move square is already taken, defer update.

    if (moves[buttonIndex] != ZeroWidthJoiner)
      return await interaction.deferUpdate()

    // Check if user made a winning move or if game is tied.

    moves[buttonIndex] = currentTurn.marker

    const winningMoves = checkWinner(moves)
    const winner = winningMoves ? currentTurn.player : null

    const gameTied = moves.every((move) => move != ZeroWidthJoiner)

    // Update game data.

    if (winner || gameTied) await gameSchema.deleteOne()
    else {
      currentTurn.marker = currentTurn.marker == "❌" ? "⭕" : "❌"
      currentTurn.player =
        gameSchema.players.find((player) => player != interaction.user.id) ||
        currentTurn.player

      gameSchema.markModified("gameData")
      await gameSchema.save()
    }

    // Update message data.

    const regularDescription = winner
      ? `<@${winner}> has won!`
      : `<@${currentTurn.player}> it's your go. Make a move!`
    const tiedDescription = gameTied ? "Game is tied! Nobody wins." : null

    const button = (index: number) => {
      const buttonBuilder = new ButtonBuilder()
        .setCustomId("tictactoe." + (index + 1))
        .setStyle(ButtonStyle.Secondary)

      if (winningMoves)
        winningMoves.includes(index)
          ? buttonBuilder.setDisabled(false)
          : buttonBuilder.setDisabled(true)

      if (gameTied) buttonBuilder.setDisabled(true)

      moves[index] == ZeroWidthJoiner
        ? buttonBuilder.setLabel(moves[index])
        : buttonBuilder.setEmoji(moves[index])

      return buttonBuilder
    }

    await interaction.deferUpdate()

    await interaction.message.edit({
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          button(0),
          button(1),
          button(2),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          button(3),
          button(4),
          button(5),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          button(6),
          button(7),
          button(8),
        ),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setDescription(tiedDescription ?? regularDescription)
          .setTitle("TicTacToe"),
      ],
    })
  }
})

const checkWinner = (board: string[]): number[] | null => {
  const winningCombinations: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ]

  for (const combo of winningCombinations) {
    const [a, b, c] = combo

    if (board[a] == "❌" && board[b] == "❌" && board[c] == "❌")
      return [a, b, c]
    else if (board[a] == "⭕" && board[b] == "⭕" && board[c] == "⭕")
      return [a, b, c]
  }

  return null // No winner yet
}
