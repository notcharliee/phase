import { ButtonStyle, PermissionFlagsBits } from "discord.js"

import { z } from "zod"

import { dateToTimestamp } from "~/lib/utils/formatting"

import { MessageBuilder } from "~/structures/builders"
import { updateFormFile } from "./_form"
import { createQuestionMessage } from "./_questions"
import { formCustomIds, formErrors } from "./_utils"

import type { FormFile } from "./_form"
import type { FormQuestion } from "./_questions"
import type { FormInputInteraction } from "./_utils"
import type { Message } from "discord.js"

/**
 * Validates a string value against the question schema.
 *
 * @param question The question schema.
 * @param value The value to check.
 * @returns The validation result.
 */
export function validateValue(question: FormQuestion, value: string) {
  const { type, min, max } = question

  let schema: z.ZodSchema = z.any()

  if (type === "number") {
    schema = z
      .union([z.string(), z.number()])
      .transform((v) => (typeof v === "string" ? parseInt(v, 10) : v))
      .refine((num) => !isNaN(num), {
        message: "Your response must be a valid number.",
      })

    if (min !== undefined)
      schema = (schema as z.ZodNumber).min(min, {
        message: `Your response must be greater than or equal to ${min}.`,
      })
    if (max !== undefined)
      schema = (schema as z.ZodNumber).max(max, {
        message: `Your response must be less than or equal to ${max}.`,
      })
  } else if (type === "string") {
    schema = z.string({ message: "Your response must be a string." })

    if (min !== undefined)
      schema = (schema as z.ZodString).min(min, {
        message: `Your response must be at least ${min} characters long.`,
      })
    if (max !== undefined)
      schema = (schema as z.ZodString).max(max, {
        message: `Your response must be at most ${max} characters long.`,
      })
  }

  const result = schema.safeParse(value) as z.SafeParseReturnType<
    string,
    string | number | boolean
  >

  return result
}

/**
 * Handles the input for the form.
 *
 * @param initialFormMessage The initial form message.
 * @param formFile The form file.
 * @param interaction The interaction.
 * @param value The value to handle.
 */
export async function handleInput(
  initialFormMessage: Message,
  formFile: FormFile,
  interaction: FormInputInteraction,
  value: string | number | boolean | null,
) {
  await interaction.deferUpdate()

  formFile.responses.push(value)

  const nextQuestionExists =
    formFile.questions.length > formFile.responses.length

  formFile.metadata.completedAt = nextQuestionExists
    ? null
    : new Date().toISOString()

  await updateFormFile(initialFormMessage, formFile)

  if (nextQuestionExists) {
    const nextQuestionMessage = createQuestionMessage(
      formFile,
      formFile.responses.length,
    )

    if (interaction.isModalSubmit()) {
      await interaction.message.edit(nextQuestionMessage)
    } else {
      await interaction.update(nextQuestionMessage)
    }
  } else {
    const guild = interaction.guild!

    const submissionsChannel =
      guild.channels.cache.get(formFile.metadata.submissionChannelId) ??
      (await guild.channels
        .fetch(formFile.metadata.submissionChannelId)
        .catch(() => null))

    if (!submissionsChannel?.isSendable()) {
      return await interaction.message.edit({
        ...formErrors.submissionsChannelNotFound(true),
        components: [],
      })
    }

    if (
      !submissionsChannel
        .permissionsFor(interaction.guild!.members.me!)
        .has(PermissionFlagsBits.SendMessages)
    ) {
      return await interaction.message.edit({
        ...formErrors.missingSubmitPermissions(true),
        components: [],
      })
    }

    const submissionMessage = new MessageBuilder()

    submissionMessage.setEmbeds((embed) => {
      embed.setColor("Primary")
      embed.setTitle(formFile.metadata.formName)
      embed.setFooter({ text: `User ID: ${interaction.user.id}` })
      embed.setTimestamp()

      embed.setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })

      embed.setDescription(
        `
          **Started:** ${dateToTimestamp(new Date(formFile.metadata.startedAt))}
          **Completed:** ${dateToTimestamp(new Date(formFile.metadata.completedAt!))}
          **Status:** \`pending\`
        `,
      )

      for (let i = 0; i < formFile.questions.length; i++) {
        const question = formFile.questions[i]!
        const response = formFile.responses[i]!

        const responseText =
          typeof response === "boolean"
            ? response
              ? "Yes"
              : "No"
            : response === null
              ? "*Skipped*"
              : response.toString()

        embed.addFields({
          name: question.label,
          value: responseText,
        })
      }

      return embed
    })

    submissionMessage.setComponents([
      (actionrow) => {
        actionrow.addButton((button) => {
          return button
            .setCustomId(
              formCustomIds.accept(
                formFile.metadata.formId,
                interaction.channelId,
              ),
            )
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success)
        })
        actionrow.addButton((button) => {
          return button
            .setCustomId(
              formCustomIds.reject(
                formFile.metadata.formId,
                interaction.channelId,
              ),
            )
            .setLabel("Reject")
            .setStyle(ButtonStyle.Danger)
        })
        return actionrow
      },
      (actionrow) => {
        actionrow.addButton((button) => {
          return button
            .setCustomId(
              formCustomIds.acceptWithReasonModal(
                formFile.metadata.formId,
                interaction.channelId,
              ),
            )
            .setLabel("Accept with reason")
            .setStyle(ButtonStyle.Success)
        })
        actionrow.addButton((button) => {
          return button
            .setCustomId(
              formCustomIds.rejectWithReasonModal(
                formFile.metadata.formId,
                interaction.channelId,
              ),
            )
            .setLabel("Reject with reason")
            .setStyle(ButtonStyle.Danger)
        })
        return actionrow
      },
    ])

    const responseMessage = new MessageBuilder()

    responseMessage.setEmbeds((embed) => {
      const content =
        "Your responses have been sent to the server staff for review. You'll be notified of any updates here. Thanks for completing the form!"

      embed.setColor("Primary")
      embed.setTitle("Form submitted")
      embed.setDescription(content)
      embed.setFooter({ text: "All done!  •  100% complete" })

      return embed
    })

    responseMessage.setComponents([])

    try {
      await submissionsChannel.send(submissionMessage)
      await interaction.update(responseMessage)
    } catch (error) {
      const errorMessage = `Failed to send form submission message to channel ${submissionsChannel.id} in guild ${interaction.guildId}:`
      console.error(errorMessage)
      console.error(error)
    }
  }
}
