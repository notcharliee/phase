import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import dedent from "dedent"

import { ZeroWidthJoiner } from "~/lib/emojis"

import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  Message,
} from "discord.js"

export default new BotCommandBuilder()
  .setName("tictactoe")
  .setDescription("Starts a game of tic-tac-toe.")
  .setDMPermission(false)
  .addUserOption((option) =>
    option
      .setName("opponent")
      .setDescription("The opponent you want to select.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const host = interaction.member as GuildMember
    const opponent = interaction.options.getMember("opponent") as GuildMember
    const players = { "❌": opponent, "⭕": host }

    const moves = Array.from({ length: 9 }).map(() => ZeroWidthJoiner)
    let turn: "❌" | "⭕" = "❌"
    let tied = false
    let winner: {
      member: GuildMember
      marker: "❌" | "⭕"
      winningMoves: number[]
    }

    const makeMove = (move: number) => {
      const checkWinner = () => {
        const winningCombinations = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ] as const

        for (const combo of winningCombinations) {
          const [a, b, c] = combo

          if (moves[a] === turn && moves[b] === turn && moves[c] === turn) {
            return [a, b, c]
          }
        }

        return false
      }

      const checkTie = () =>
        !winner && moves.every((move) => move !== ZeroWidthJoiner)

      if (moves[move] === ZeroWidthJoiner) {
        moves[move] = turn

        const isWinner = checkWinner()
        const isTie = checkTie()

        if (isWinner) {
          winner = {
            member: players[turn],
            marker: turn,
            winningMoves: isWinner,
          }
        } else if (isTie) {
          tied = true
        } else {
          turn = turn === "❌" ? "⭕" : "❌"
        }
      }
    }

    const createMessage = async (
      interaction: ButtonInteraction | ChatInputCommandInteraction,
    ) => {
      const commandMention = `</tictactoe:${interaction.isChatInputCommand() ? interaction.id : interaction.client.application.commands.cache.find((command) => command.name === "tictactoe")!.id}>`

      const content = dedent`
        :zap: **${players["❌"].displayName}** vs **${players["⭕"].displayName}** :zap:
        ${
          winner
            ? `<@${winner.member.id}> has won! Play again! ${commandMention}`
            : tied
              ? `It's a tie. Play again! ${commandMention}`
              : `<@${players[turn].id}> it's your turn, make a move!`
        }
      `

      const components = Array.from({ length: 3 }).map((_, rowIndex) =>
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          ...Array.from({ length: 3 }).map((_, buttonIndex) => {
            const index = rowIndex * 3 + buttonIndex

            return new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel(moves[index]!)
              .setCustomId(
                winner
                  ? `games.tictactoe.${index}`
                  : `games.tictactoe.${index}`,
              )
              .setDisabled(
                winner ? !winner?.winningMoves.includes(index) : tied,
              )
          }),
        ),
      )

      const awaitMessageComponent = (message: Message) =>
        message
          .awaitMessageComponent({
            filter: (buttonInteraction) =>
              buttonInteraction.user.id === host.id ||
              buttonInteraction.user.id === opponent.id,
            componentType: ComponentType.Button,
            time: 1000 * 60 * 5,
          })
          .then(async (buttonInteraction) => {
            if (buttonInteraction.user.id !== players[turn].id) {
              await buttonInteraction.reply({
                content: "Wait your turn!",
              })
            } else {
              await buttonInteraction.deferUpdate()
              makeMove(+buttonInteraction.customId.split(".")[2]!)
            }

            await createMessage(buttonInteraction)
          })
          .catch(() => {
            void message.edit({
              content: dedent`
                ${message.content.split("\n")[0]}
                Game timed out due to inactivity.
              `,
              components: message.components.map((component) => {
                const json = component.toJSON()

                return {
                  ...json,
                  components: json.components.map((button) => {
                    button.disabled = true
                    return button
                  }),
                }
              }),
            })

            void message.reply(dedent`
              Game timed out due to inactivity.
              You can start a new game with ${commandMention}
            `)
          })

      if (interaction.isChatInputCommand()) {
        const gameMessage = await interaction.reply({
          content,
          components,
          fetchReply: true,
        })

        await awaitMessageComponent(gameMessage)
      } else {
        const gameMessage = await interaction.channel!.send({
          content,
          components,
        })

        // Only await the button interaction if the game is not over.
        if (!winner && !tied) await awaitMessageComponent(gameMessage)

        void interaction.message.delete()
      }
    }

    await createMessage(interaction)
  })
