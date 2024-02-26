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
