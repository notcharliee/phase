import { bold, userMention } from "discord.js"

import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageBuilder,
} from "~/structures/builders"

import type { FormAction, FormActionInteraction, FormThread } from "./_utils"

/**
 * Handles the status update for a form submission.
 *
 * @param formAction The action that was performed on the form.
 * @param formThread The form thread that the submission is in.
 * @param interaction The interaction that triggered the action.
 * @param reason The reason for the action.
 */
export async function handleStatusUpdate(
  formAction: FormAction,
  formThread: FormThread,
  interaction: FormActionInteraction,
  reason?: string,
) {
  const embed = interaction.message.embeds[0]!
  const components = interaction.message.components

  const newStatus =
    `${formAction.split("_")[0] as "accept" | "reject"}ed` as const

  const submitterUserId = embed.footer?.text.split(": ")[1]
  const moderatorUserId = interaction.user.id

  try {
    const statusUpdateMessage = new MessageBuilder()
      .setContent(submitterUserId ? userMention(submitterUserId) : undefined)
      .setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("Submission Updated")
          .setDescription(
            `Your form submission has been ${bold(newStatus)} by ${userMention(
              moderatorUserId,
            )} ${reason ? `with the following reason:\n\n*${reason}*` : ""}`,
          )
          .setTimestamp()
      })

    if (!formThread.lastMessage) await formThread.send(statusUpdateMessage)
    else await formThread.lastMessage.reply(statusUpdateMessage)
  } catch (error) {
    const message = `Failed to send form submission status update to form thread ${formThread.id} from parent channel ${formThread.parentId} in guild ${interaction.guildId}:`
    console.error(message)
    console.error(error)
  }

  try {
    const updatedSubmissionMessage = new MessageBuilder()
      .setEmbeds(
        new EmbedBuilder(embed.toJSON()).setDescription(
          embed.description!.replace(
            `**Status:** \`pending\``,
            `**Status:** \`${newStatus}\``,
          ),
        ),
      )
      .setComponents(
        components.map((actionrow) => {
          return new ActionRowBuilder({
            components: actionrow.components.map((button) => ({
              ...button.toJSON(),
              disabled: true,
            })),
          })
        }),
      )

    await interaction.message.edit(updatedSubmissionMessage)
  } catch (error) {
    console.error(`Failed to edit form submission message:`)
    console.error(error)
  }

  try {
    const statusUpdateMessage = new MessageBuilder().setEmbeds((embed) => {
      return embed
        .setColor("Primary")
        .setTitle("Submission Updated")
        .setDescription(
          `Submission was ${bold(newStatus)} by ${userMention(
            moderatorUserId,
          )} ${reason ? `with the following reason:\n\n*${reason}*` : ""}`,
        )
        .setTimestamp()
    })

    return await interaction.editReply(statusUpdateMessage)
  } catch (error) {
    console.error(`Failed to send form submission status update:`)
    console.error(error)
  }
}
