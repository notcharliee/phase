import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
  ThreadAutoArchiveDuration,
} from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/config/phase/modules.ts"
import dedent from "dedent"
import { z } from "zod"

import { cache } from "~/lib/cache"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"
import {
  createHiddenContent,
  dateToTimestamp,
  parseHiddenContent,
  truncateString,
} from "~/lib/utils"

import type {
  BaseGuildTextChannel,
  ButtonInteraction,
  Message,
  MessageComponentInteraction,
  MessageCreateOptions,
  ModalMessageModalSubmitInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  ThreadChannel,
} from "discord.js"

enum FormAction {
  CreateForm = "start", // TODO: rename to create
  DeleteForm = "delete",
  AcceptSubmission = "accept",
  AcceptSubmissionWithReasonModal = "accept_with_reason_modal",
  AcceptSubmissionWithReasonTrigger = "accept_with_reason_trigger",
  AcceptSubmissionWithReasonValue = "accept_with_reason_value",
  RejectSubmission = "reject",
  RejectSubmissionWithReasonModal = "reject_with_reason_modal",
  RejectSubmissionWithReasonTrigger = "reject_with_reason_trigger",
  RejectSubmissionWithReasonValue = "reject_with_reason_value",
}

enum FormInput {
  ButtonYes = "input_button_yes",
  ButtonNo = "input_button_no",
  ButtonSkip = "input_button_skip",
  Modal = "input_modal",
  ModalTrigger = "input_modal_trigger",
  ModalValue = "input_modal_value",
  Select = "input_select",
}

// prettier-ignore
const customIds = {
  create: (formId: string) => `form.${FormAction.CreateForm}.${formId}`,
  delete: (formId: string, formThreadId: string) => `form.${FormAction.DeleteForm}.${formId}.${formThreadId}`,
  accept: (formId: string, formThreadId: string) => `form.${FormAction.AcceptSubmission}.${formId}.${formThreadId}`,
  acceptWithReasonModal: (formId: string, formThreadId: string) => `form.${FormAction.AcceptSubmissionWithReasonModal}.${formId}.${formThreadId}`,
  acceptWithReasonTrigger: (formId: string, formThreadId: string) => `form.${FormAction.AcceptSubmissionWithReasonTrigger}.${formId}.${formThreadId}`,
  acceptWithReasonValue: (formId: string, formThreadId: string) => `form.${FormAction.AcceptSubmissionWithReasonValue}.${formId}.${formThreadId}`,
  reject: (formId: string, formThreadId: string) => `form.${FormAction.RejectSubmission}.${formId}.${formThreadId}`,
  rejectWithReasonModal: (formId: string, formThreadId: string) => `form.${FormAction.RejectSubmissionWithReasonModal}.${formId}.${formThreadId}`,
  rejectWithReasonTrigger: (formId: string, formThreadId: string) => `form.${FormAction.RejectSubmissionWithReasonTrigger}.${formId}.${formThreadId}`,
  rejectWithReasonValue: (formId: string, formThreadId: string) => `form.${FormAction.RejectSubmissionWithReasonValue}.${formId}.${formThreadId}`,

  input_button_yes: `form.${FormInput.ButtonYes}`,
  input_button_no: `form.${FormInput.ButtonNo}`,
  input_button_skip: `form.${FormInput.ButtonSkip}`,
  input_modal: `form.${FormInput.Modal}`,
  input_modal_trigger: `form.${FormInput.ModalTrigger}`,
  input_modal_value: `form.${FormInput.ModalValue}`,
  input_select: `form.${FormInput.Select}`,
}

const errors = {
  formNotFound: new BotError(
    "The form associated with this button no longer exists.",
  ).toJSON(),
  formChannelNotFound: new BotError(
    "The form channel associated with this button no longer exists.",
  ).toJSON(),
  formThreadNotFound: new BotError(
    "The form thread associated with this button no longer exists.",
  ).toJSON(),
  submissionsChannelNotFound: (embed?: boolean) =>
    embed
      ? new BotError({
          title: "Form submission failed",
          description:
            "The submissions channel associated with this form no longer exists.",
        }).toJSON()
      : new BotError(
          "The submissions channel associated with this form no longer exists.",
        ).toJSON(),
  missingSubmitPermissions: (embed?: boolean) =>
    embed
      ? new BotError({
          title: "Form submission failed",
          description:
            "I do not have the `SEND_MESSAGES` permission in the form submissions channel, which is required to perform this action.",
        }).toJSON()
      : new BotError(
          "I do not have the `SEND_MESSAGES` permission in the form submissions channel, which is required to perform this action.",
        ).toJSON(),
}

const formFileSchema = z.object({
  metadata: z.object({
    formName: z.string(),
    formId: z.string(),
    userId: z.string(),
    guildId: z.string(),
    submissionChannelId: z.string(),
    initialMessageId: z.string(),
    startedAt: z.string(),
    completedAt: z.string().nullable(),
  }),
  questions: z.array(
    z.object({
      label: z.string(),
      type: z.enum(["string", "number", "boolean"]),
      required: z.boolean(),
      choices: z.array(z.string()).transform((v) => (v.length ? v : undefined)),
      min: z.number().optional(),
      max: z.number().optional(),
    }),
  ),
  responses: z.union([z.string(), z.number(), z.boolean(), z.null()]).array(),
})

type FormFile = z.infer<typeof formFileSchema>
type FormQuestion = FormFile["questions"][number]

/**
 * Fetches the initial form message containing the form file.
 *
 * @param message The question message containing hidden content.
 * @returns The initial form message.
 */
async function getInitialFormMessage(message: Message) {
  const threadChannel = message.channel
  const initialMessageId = parseHiddenContent(message.content)

  const initialFormMessage =
    threadChannel?.messages.cache.get(initialMessageId) ??
    (await threadChannel?.messages.fetch(initialMessageId).catch(() => null))

  return initialFormMessage
}

/**
 * Fetches the form file from the message attachments.
 *
 * @param message The initial form message containing the form file.
 * @returns The parsed form file contents.
 */
async function getFormFile(message: Message) {
  const formFileURL = message?.attachments.first()?.url

  if (!formFileURL) {
    throw new Error("No form file found in the message attachments.")
  }

  const unparsedFormFile = await fetch(formFileURL).then((res) => res.json())
  const parsedFormFile = formFileSchema.parse(unparsedFormFile)

  return parsedFormFile
}

/**
 * Updates the form file in the initial form message.
 *
 * @param initialFormMessage The initial form message.
 * @param formFile The form file.
 */
function updateFormFile(initialFormMessage: Message, formFile: FormFile) {
  return initialFormMessage.edit({
    content: "You can ignore this file, it's just here to hold your responses.",
    files: [
      new AttachmentBuilder(Buffer.from(JSON.stringify(formFile, null, 2)), {
        name: "form_responses", // omit the file extension to avoid discord's file preview on desktop
      }),
    ],
  })
}

/**
 * Creates a question message for the form.
 *
 * @param formFile The form file.
 * @param questionIndex The index of the question.
 * @returns The question message object.
 */
function createQuestionMessage(formFile: FormFile, questionIndex: number) {
  const totalQuestions = formFile.questions.length
  const currentQuestion = formFile.questions[questionIndex]

  if (!currentQuestion) {
    throw new Error("No question found at the specified index")
  }

  const title = `${questionIndex + 1}/${totalQuestions} - ${currentQuestion.label}`

  const description =
    (currentQuestion.choices ?? currentQuestion.type === "boolean")
      ? "Select one of the options below."
      : "Press the button below to enter your answer."

  const percentageComplete = Math.floor((questionIndex / totalQuestions) * 100)

  const footerText = `${currentQuestion.required ? "Required" : "Optional"}  •  ${percentageComplete}% complete`
  const footer = { text: footerText }

  const skipButton = new ButtonBuilder()
    .setCustomId(customIds.input_button_skip)
    .setLabel("Skip")
    .setStyle(ButtonStyle.Secondary)

  return {
    content: createHiddenContent(formFile.metadata.initialMessageId!),
    embeds: [
      new EmbedBuilder()
        .setColor(PhaseColour.Primary)
        .setTitle(title)
        .setDescription(description)
        .setFooter(footer),
    ],
    components: [
      currentQuestion.choices
        ? new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(customIds.input_select)
              .setPlaceholder("Select an option")
              .setMaxValues(1)
              .setMinValues(1)
              .setOptions(
                currentQuestion.choices.map((choice, index) =>
                  new StringSelectMenuOptionBuilder()
                    .setLabel(truncateString(choice, 100))
                    .setValue(index.toString()),
                ),
              ),
          )
        : currentQuestion.type === "boolean"
          ? new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(customIds.input_button_yes)
                .setLabel("Yes")
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId(customIds.input_button_no)
                .setLabel("No")
                .setStyle(ButtonStyle.Secondary),
              ...(!currentQuestion.required ? [skipButton] : []),
            )
          : new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(customIds.input_modal_trigger)
                .setLabel("Open modal")
                .setStyle(ButtonStyle.Secondary),
              ...(!currentQuestion.required ? [skipButton] : []),
            ),
    ],
  } satisfies MessageCreateOptions
}

/**
 * Creates a question input modal for the form.
 *
 * @param question The question schema.
 * @returns The modal.
 */
function createQuestionInputModal(question: FormQuestion) {
  const modalInputStyle =
    question.type === "string" ? TextInputStyle.Paragraph : TextInputStyle.Short

  const modalInput = new TextInputBuilder()
    .setCustomId(customIds.input_modal_value)
    .setLabel(truncateString(question.label, 45))
    .setMinLength(question.min ?? 1)
    .setMaxLength(question.max ?? 256)
    .setStyle(modalInputStyle)
    .setRequired(true)

  const modal = new ModalBuilder()
    .setCustomId(customIds.input_modal)
    .setTitle(truncateString(question.label, 45))
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(modalInput),
    )

  return modal
}

/**
 * Validates a string value against the question schema.
 *
 * @param question The question schema.
 * @param value The value to check.
 * @returns The validation result.
 */
function validateValue(question: FormQuestion, value: string) {
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
async function handleInput(
  initialFormMessage: Message,
  formFile: FormFile,
  interaction:
    | ButtonInteraction
    | ModalSubmitInteraction
    | StringSelectMenuInteraction,
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

    await interaction.message!.edit(nextQuestionMessage)
  } else {
    const submissionsChannel = (interaction.client.channels.cache.get(
      formFile.metadata.submissionChannelId,
    ) ??
      (await interaction.client.channels
        .fetch(formFile.metadata.submissionChannelId)
        .catch(() => null))) as BaseGuildTextChannel | null

    if (!submissionsChannel) {
      return await interaction.message!.edit({
        ...errors.submissionsChannelNotFound(true),
        components: [],
      })
    }

    if (
      !submissionsChannel
        .permissionsFor(interaction.guild!.members.me!)
        .has(PermissionFlagsBits.SendMessages)
    ) {
      return await interaction.message!.edit({
        ...errors.missingSubmitPermissions(true),
        components: [],
      })
    }

    await submissionsChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle(formFile.metadata.formName)
            .setDescription(
              dedent`
                **Started:** ${dateToTimestamp(new Date(formFile.metadata.startedAt))}
                **Completed:** ${dateToTimestamp(new Date(formFile.metadata.completedAt!))}
                **Status:** \`pending\`
              `,
            )
            .setFields(
              formFile.questions.map((question, index) => {
                const response = formFile.responses[index]!
                const responseText =
                  typeof response === "boolean"
                    ? response
                      ? "Yes"
                      : "No"
                    : response === null
                      ? "*Skipped*"
                      : response.toString()

                return {
                  name: question.label,
                  value: responseText,
                }
              }),
            )
            .setFooter({ text: `User ID: ${interaction.user.id}` })
            .setTimestamp(),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(
                customIds.accept(
                  formFile.metadata.formId,
                  interaction.channelId!,
                ),
              )
              .setLabel("Accept")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(
                customIds.acceptWithReasonTrigger(
                  formFile.metadata.formId,
                  interaction.channelId!,
                ),
              )
              .setLabel("Accept with reason")
              .setStyle(ButtonStyle.Success),
          ),
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(
                customIds.reject(
                  formFile.metadata.formId,
                  interaction.channelId!,
                ),
              )
              .setLabel("Reject")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(
                customIds.rejectWithReasonTrigger(
                  formFile.metadata.formId,
                  interaction.channelId!,
                ),
              )
              .setLabel("Reject with reason")
              .setStyle(ButtonStyle.Danger),
          ),
        ],
      })
      .catch((error) => {
        console.error(
          `Failed to send form submission message to channel ${submissionsChannel.id} in guild ${interaction.guildId}:`,
          error,
        )
      })

    await interaction.message!.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Form submitted")
          .setDescription(
            `Your responses have been sent to the server staff for review. You'll be notified of any updates here. Thanks for completing the form!`,
          )
          .setFooter({ text: "All done!  •  100% complete" }),
      ],
      components: [],
    })
  }
}

/**
 * Handles the status update for a form submission.
 *
 * @param formAction The action that was performed on the form.
 * @param formThread The form thread that the submission is in.
 * @param interaction The interaction that triggered the action.
 * @param reason The reason for the action.
 * @returns
 */
async function handleStatusUpdate(
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
          `Your form submission has been **${newStatus}** by ${interaction.user} ${reason ? `for the following reason:\n\n*${reason}*` : ""}`,
        )
        .setTimestamp(),
    ],
  } satisfies MessageCreateOptions

  await (
    formThread.lastMessage
      ? formThread.lastMessage.reply(submissionStatusUpdateMessage)
      : formThread.send(submissionStatusUpdateMessage)
  ).catch((error) => {
    console.error(
      `Failed to send form submission status update to form thread ${formThread!.id} of parent channel ${formThread!.parentId} in guild ${interaction.guildId}:`,
      error,
    )
  })

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
            `Submission was **${newStatus}** by ${interaction.user} ${reason ? `for the following reason:\n\n*${reason}*` : ""}`,
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

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (_, interaction) => {
    if (
      (!interaction.isButton() &&
        !interaction.isModalSubmit() &&
        !interaction.isStringSelectMenu()) ||
      !interaction.inGuild() ||
      !interaction.channel?.isTextBased() ||
      !interaction.customId.startsWith("form")
    ) {
      return
    }

    const customIdParts = interaction.customId.split(".")
    const formActionOrInput = customIdParts[1] as FormAction | FormInput

    if ((Object.values(FormAction) as string[]).includes(formActionOrInput)) {
      const formAction = formActionOrInput as FormAction
      const formId = customIdParts[2] as string
      const formThreadId = customIdParts[3]

      if (
        interaction.isButton() &&
        (formAction === FormAction.AcceptSubmissionWithReasonTrigger ||
          formAction === FormAction.RejectSubmissionWithReasonTrigger)
      ) {
        const modal = new ModalBuilder()
          .setCustomId(customIds.acceptWithReasonModal(formId, formThreadId!))
          .setTitle("Reason")
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId(
                  customIds.acceptWithReasonValue(formId, formThreadId!),
                )
                .setLabel("Provide a reason")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(1)
                .setMaxLength(2000)
                .setRequired(true),
            ),
          )

        return await interaction.showModal(modal)
      }

      await interaction.deferReply({ ephemeral: true })

      // the module config from the database

      const guildDoc = await cache.guilds.get(interaction.guildId!)
      const moduleConfig = guildDoc?.modules?.[ModuleId.Forms]

      if (!moduleConfig?.enabled) {
        return await interaction.editReply(
          BotError.moduleNotEnabled(ModuleId.Forms).toJSON(),
        )
      }

      // the form data from the module config

      const form = moduleConfig.forms.find((form) => form.id === formId)

      if (!form) return await interaction.editReply(errors.formNotFound)

      // the channel where this form's threads are created

      const formChannel = (interaction.client.channels.cache.get(
        form.channel,
      ) ??
        (await interaction.client.channels
          .fetch(form.channel)
          .catch(() => null))) as BaseGuildTextChannel | null

      if (!formChannel)
        return await interaction.editReply(errors.formChannelNotFound)

      // the form thread that the submission is in

      const formThread = formThreadId
        ? formChannel.threads.cache.get(formThreadId)
        : null

      if (formThreadId && !formThread)
        return await interaction.editReply(errors.formThreadNotFound)

      // the channel where the form submissions are sent

      const submissionsChannel = (interaction.client.channels.cache.get(
        form.channel,
      ) ??
        (await interaction.client.channels
          .fetch(form.channel)
          .catch(() => null))) as BaseGuildTextChannel | null

      if (!submissionsChannel)
        return await interaction.editReply(errors.submissionsChannelNotFound())

      if (
        !submissionsChannel
          .permissionsFor(interaction.guild!.members.me!)
          .has(PermissionFlagsBits.SendMessages)
      ) {
        return await interaction.editReply(errors.missingSubmitPermissions())
      }

      // handles form creation, deletion, and submission acceptance/rejection without a reason //

      if (interaction.isButton() && interaction.isMessageComponent()) {
        switch (formAction) {
          case FormAction.CreateForm: {
            const threadChannel = await formChannel.threads.create({
              name: form.name,
              autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
              type: ChannelType.PrivateThread,
              reason: "Form process started",
              invitable: false,
            })

            const initialFormMessage = await threadChannel.send({
              content: `${interaction.user} getting your form ready ...`,
            })

            const formFile: FormFile = {
              metadata: {
                formName: form.name,
                formId: form.id,
                userId: interaction.user.id,
                guildId: interaction.guildId,
                submissionChannelId: moduleConfig.channel,
                initialMessageId: initialFormMessage.id,
                startedAt: new Date().toISOString(),
                completedAt: null,
              },
              questions: form.questions,
              responses: [],
            } satisfies FormFile

            await updateFormFile(initialFormMessage, formFile)

            await threadChannel.send(createQuestionMessage(formFile, 0))

            return await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor(PhaseColour.Primary)
                  .setTitle("Form created")
                  .setDescription(
                    "Your form has been created and is ready to be filled out.",
                  ),
              ],
              components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                  new ButtonBuilder()
                    .setURL(threadChannel.url)
                    .setLabel("Go to form")
                    .setStyle(ButtonStyle.Link),
                  new ButtonBuilder()
                    .setCustomId(customIds.delete(form.id, threadChannel.id))
                    .setLabel("Delete form")
                    .setStyle(ButtonStyle.Danger),
                ),
              ],
            })
          }
          case FormAction.DeleteForm: {
            await formThread!.delete()

            return await interaction.editReply({
              content: "Your form thread has been deleted.",
            })
          }
          case FormAction.AcceptSubmission: {
            return await handleStatusUpdate(
              formAction,
              formThread!,
              interaction,
            )
          }
          case FormAction.RejectSubmission: {
            return await handleStatusUpdate(
              formAction,
              formThread!,
              interaction,
            )
          }
        }
      }

      // handles form submission acceptance/rejection with a reason //

      if (interaction.isModalSubmit() && interaction.isFromMessage()) {
        switch (formAction) {
          case FormAction.AcceptSubmissionWithReasonModal: {
            const modalValueId = customIds.acceptWithReasonValue(
              formId,
              formThreadId!,
            )

            const modalValue =
              interaction.fields.getTextInputValue(modalValueId)

            return await handleStatusUpdate(
              formAction,
              formThread!,
              interaction,
              modalValue,
            )
          }
          case FormAction.RejectSubmissionWithReasonModal: {
            const modalValueId = customIds.rejectWithReasonValue(
              formId,
              formThreadId!,
            )

            const modalValue =
              interaction.fields.getTextInputValue(modalValueId)

            return await handleStatusUpdate(
              formAction,
              formThread!,
              interaction,
              modalValue,
            )
          }
        }
      }
    }

    // handles question inputs from form threads //

    if ((Object.values(FormInput) as string[]).includes(formActionOrInput)) {
      const formInput = formActionOrInput as FormInput

      const interactionMessage = interaction.message!
      const initialFormMessage = await getInitialFormMessage(interactionMessage)

      if (!initialFormMessage) {
        return await interaction.reply(errors.formNotFound)
      }

      const formFile = await getFormFile(initialFormMessage)
      const currentQuestion = formFile.questions[formFile.responses.length]!

      if (interaction.isButton()) {
        switch (formInput) {
          case FormInput.ButtonYes: {
            return await handleInput(
              initialFormMessage,
              formFile,
              interaction,
              true,
            )
          }
          case FormInput.ButtonNo: {
            return await handleInput(
              initialFormMessage,
              formFile,
              interaction,
              false,
            )
          }
          case FormInput.ButtonSkip: {
            return await handleInput(
              initialFormMessage,
              formFile,
              interaction,
              null,
            )
          }
          case FormInput.ModalTrigger: {
            return await interaction.showModal(
              createQuestionInputModal(currentQuestion),
            )
          }
        }
      }

      if (interaction.isModalSubmit()) {
        const modalValueId = customIds.input_modal_value
        const modalValue = interaction.fields.getTextInputValue(modalValueId)

        const { data, error, success } = validateValue(
          currentQuestion,
          modalValue,
        )

        if (!success) {
          return await interaction.reply(new BotError(error.message).toJSON())
        }

        return await handleInput(
          initialFormMessage,
          formFile,
          interaction,
          data,
        )
      }

      if (interaction.isStringSelectMenu()) {
        const dropdownValue = interaction.values[0]!
        const choiceIndex = parseInt(dropdownValue, 10)
        const choice = currentQuestion.choices![choiceIndex]!

        return await handleInput(
          initialFormMessage,
          formFile,
          interaction,
          choice,
        )
      }
    }
  })
