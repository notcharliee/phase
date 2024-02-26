import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
} from "discord.js"
import { PhaseURL } from "~/utils"

export const memberNotFound = (
  ephemeral?: boolean,
): InteractionReplyOptions => ({
  components: [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setLabel("Report a Bug")
        .setStyle(ButtonStyle.Link)
        .setURL(PhaseURL.PhaseSupport),
    ),
  ],
  embeds: [
    new EmbedBuilder()
      .setTitle("Member Not Found")
      .setDescription(
        "Member not found. Make sure they are in this server, then try again.",
      )
      .setColor("Red"),
  ],
  ephemeral,
})

/**
 *
 * @param array The array to use.
 * @param amount The number of elements.
 * @returns Array of random elements.
 */
export function getRandomArrayElements(array: any[], amount: number) {
  const shuffledArray = [...array]

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }

  return shuffledArray.slice(0, amount)
}
