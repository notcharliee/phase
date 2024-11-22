import {
  ComponentType,
  DiscordjsError,
  DiscordjsErrorCodes,
  StringSelectMenuBuilder,
} from "discord.js"
import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { MessageBuilder } from "~/structures/builders/MessageBuilder"

import { Connect4 } from "~/structures/games/Connect4"

import type { BoardColumnIndex } from "~/structures/games/Connect4"
import type { Message } from "discord.js"

const indexWordMap: Record<BoardColumnIndex, string> = {
  0: "One",
  1: "Two",
  2: "Three",
  3: "Four",
  4: "Five",
  5: "Six",
  6: "Seven",
}

const indexEmojiMap: Record<BoardColumnIndex, string> = {
  0: "1️⃣",
  1: "2️⃣",
  2: "3️⃣",
  3: "4️⃣",
  4: "5️⃣",
  5: "6️⃣",
  6: "7️⃣",
}

export default new BotSubcommandBuilder()
  .setName("connect-4")
  .setDescription("Starts a game of connect-4.")
  .addUserOption((option) =>
    option
      .setName("opponent")
      .setDescription("The opponent you want to select.")
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const player1 = interaction.user
    const player2 = interaction.options.getUser("opponent", true)

    const connect4 = new Connect4(interaction.client, [player1, player2])

    const message = await interaction.reply({
      fetchReply: true,
      ...createMessage(connect4),
    })

    await attachInteractionListener(connect4, message)
  })

function createMessage(connect4: Connect4, disabled = false) {
  return new MessageBuilder()
    .setContent(`<@${connect4.currentPlayer.id}> it's your turn, make a move!`)
    .setEmbeds((embed) => {
      return embed.setColor("Primary").setTitle("Connect-4").setDescription(`
          **Player 1:** <@${connect4.players[0].id}>
          **Player 2:** <@${connect4.players[1].id}>

          ${connect4.board.map((row) => row.join("")).join("\n")}

          ${Object.values(indexEmojiMap).join("")}
        `)
    })
    .setComponents((actionrow) => {
      return actionrow.addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("games.connect4.select")
          .setPlaceholder("Select a column")
          .setDisabled(disabled)
          .setMaxValues(1)
          .setMinValues(1)
          .setOptions(
            connect4.availableColumns.map((column) => ({
              value: column.toString(),
              emoji: indexEmojiMap[column],
              label: indexWordMap[column],
            })),
          ),
      )
    })
}

async function attachInteractionListener(connect4: Connect4, message: Message) {
  message
    .awaitMessageComponent({
      filter: (selectMenuInteraction) =>
        connect4.currentPlayer.id === selectMenuInteraction.user.id,
      componentType: ComponentType.StringSelect,
      time: 1000 * 60 * 5,
    })
    .then(async (selectMenuInteraction) => {
      await selectMenuInteraction.deferUpdate()

      const columnIndex = Number(selectMenuInteraction.values[0]!)

      connect4.makeMove(columnIndex as BoardColumnIndex)

      if (connect4.gameOver) {
        if (connect4.winner) {
          message
            .edit({
              ...createMessage(connect4, true),
              content: `<@${connect4.winner.id}> has won!`,
            })
            .catch(() => null)
        } else {
          message
            .edit({
              ...createMessage(connect4, true),
              content: "It's a tie!",
            })
            .catch(() => null)
        }
      } else {
        message
          .edit(createMessage(connect4))
          .then(() => attachInteractionListener(connect4, message))
          .catch(() => null)
      }
    })
    .catch((err) => {
      const error = err as Error | DiscordjsError

      if (
        error instanceof DiscordjsError &&
        error.code === DiscordjsErrorCodes.InteractionCollectorError
      ) {
        void message
          .edit({
            ...createMessage(connect4, true),
            content: "Game timed out due to inactivity.",
          })
          .catch(() => null)
      } else {
        console.error(`[Connect-4]: ${error.message}`)
        console.error(error)
      }
    })
}
