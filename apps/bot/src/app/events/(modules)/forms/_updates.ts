import { ActionRowBuilder, EmbedBuilder } from "discord.js"

import { PhaseColour } from "~/lib/enums"

import type { FormAction } from "./_utils"
import type {
  ButtonBuilder,
  MessageComponentInteraction,
  MessageCreateOptions,
  ModalMessageModalSubmitInteraction,
  ThreadChannel,
} from "discord.js"

/**
 * Handles the status update for a form submission.
 *
 * @param formAction The action that was performed on the form.
 * @param formThread The form thread that the submission is in.
 * @param interaction The interaction that triggered the action.
 * @param reason The reason for the action.
 * @returns
 */
export async function handleStatusUpdate(
  formAction: FormAction,
  formThread: ThreadChannel,
  interaction: MessageComponentInteraction | ModalMessageModalSubmitInteraction,
  reason?: string,
) {
  const newStatus = formAction.split("_")[0] + "ed"

  const userId = interaction.message.embeds[0]?.footer?.text.split(": ")[1]

  const submissionStatusUpdateMessage = {
    content: userId ? `<@${userId}>` : undefined,
    embeds: [
      new EmbedBuilder()
        .setColor(PhaseColour.Primary)
        .setTitle("Submission Updated")
        .setDescription(
          `Your form submission has been **${newStatus}** by <@${interaction.user.id}> ${reason ? `for the following reason:\n\n*${reason}*` : ""}`,
        )
        .setTimestamp(),
    ],
  } satisfies MessageCreateOptions

  try {
    if (formThread.lastMessage) {
      await formThread.lastMessage.reply(submissionStatusUpdateMessage)
    } else {
      await formThread.send(submissionStatusUpdateMessage)
    }
  } catch (error) {
    console.error(
      `Failed to send form submission status update to form thread ${formThread.id} of parent channel ${formThread.parentId} in guild ${interaction.guildId}:`,
    )
    console.error(error)
  }

  // the bot will always have the permissions to edit this, so we don't need to check
  await interaction.message.edit({
    embeds: [
      new EmbedBuilder(interaction.message.embeds[0]!.toJSON()).setDescription(
        interaction.message.embeds[0]!.description!.replace(
          "**Status:** `pending`",
          `**Status:** \`${newStatus}\``,
        ),
      ),
    ],
    components: [
      ...interaction.message.components.map((actionRow) => {
        const disabledButtons = actionRow.components.map((button) => ({
          ...button.toJSON(),
          disabled: true,
        }))

        return new ActionRowBuilder<ButtonBuilder>({
          components: disabledButtons,
        })
      }),
    ],
  })

  await interaction.message
    .reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Submission Updated")
          .setDescription(
            `Submission was **${newStatus}** by <@${interaction.user.id}> ${reason ? `for the following reason:\n\n*${reason}*` : ""}`,
          )
          .setTimestamp(),
      ],
    })
    .catch((error) => {
      console.error(
        `Failed to send form submission status update to submissions channel ${interaction.channelId} in guild ${interaction.guildId}:`,
        error,
      )
    })

  return await interaction.editReply({
    content: "Submission status updated.",
  })
}
