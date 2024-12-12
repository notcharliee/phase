import { BotEventBuilder } from "@phasejs/core/builders"
import {
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  ThreadAutoArchiveDuration,
} from "discord.js"

import { ModuleId } from "@repo/utils/modules"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders"
import { getFormFile, getFormFileMessage, updateFormFile } from "./_form"
import { handleInput, validateValue } from "./_inputs"
import { createQuestionInputModal, createQuestionMessage } from "./_questions"
import { handleStatusUpdate } from "./_updates"
import { FormAction, formCustomIds, formErrors, FormInput } from "./_utils"

import type { FormFile } from "./_form"
import type { BaseGuildTextChannel } from "discord.js"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (client, interaction) => {
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
      const formId = customIdParts[2]!
      const formThreadId = customIdParts[3]

      if (
        interaction.isButton() &&
        formAction === FormAction.AcceptSubmissionWithReasonTrigger
      ) {
        const modal = new ModalBuilder()
          .setCustomId(
            formCustomIds.acceptWithReasonModal(formId, formThreadId!),
          )
          .setTitle("Reason")
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId(
                  formCustomIds.acceptWithReasonValue(formId, formThreadId!),
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

      if (
        interaction.isButton() &&
        formAction === FormAction.RejectSubmissionWithReasonTrigger
      ) {
        const modal = new ModalBuilder()
          .setCustomId(
            formCustomIds.acceptWithReasonModal(formId, formThreadId!),
          )
          .setTitle("Reason")
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId(
                  formCustomIds.acceptWithReasonValue(formId, formThreadId!),
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

      const guildDoc = client.stores.guilds.get(interaction.guildId)
      const moduleConfig = guildDoc?.modules?.[ModuleId.Forms]

      if (!moduleConfig?.enabled) {
        return await interaction.editReply(
          BotErrorMessage.moduleNotEnabled(ModuleId.Forms).toJSON(),
        )
      }

      // the form data from the module config

      const form = moduleConfig.forms.find((form) => form.id === formId)

      if (!form) return await interaction.editReply(formErrors.formNotFound)

      // the channel where this form's threads are created

      const formChannel = (interaction.client.channels.cache.get(
        form.channel,
      ) ??
        (await interaction.client.channels
          .fetch(form.channel)
          .catch(() => null))) as BaseGuildTextChannel | null

      if (!formChannel)
        return await interaction.editReply(formErrors.formChannelNotFound)

      // the form thread that the submission is in

      const formThread = formThreadId
        ? formChannel.threads.cache.get(formThreadId)
        : null

      if (formThreadId && !formThread)
        return await interaction.editReply(formErrors.formThreadNotFound)

      // the channel where the form submissions are sent

      const submissionsChannel = (interaction.client.channels.cache.get(
        form.channel,
      ) ??
        (await interaction.client.channels
          .fetch(form.channel)
          .catch(() => null))) as BaseGuildTextChannel | null

      if (!submissionsChannel)
        return await interaction.editReply(
          formErrors.submissionsChannelNotFound(),
        )

      if (
        !submissionsChannel
          .permissionsFor(interaction.guild!.members.me!)
          .has(PermissionFlagsBits.SendMessages)
      ) {
        return await interaction.editReply(
          formErrors.missingSubmitPermissions(),
        )
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
              content: `<@${interaction.user.id}> getting your form ready ...`,
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
              questions: form.questions.map((question) => ({
                ...question,
                choices: question.choices?.length
                  ? question.choices
                  : undefined,
              })),
              responses: [],
            } satisfies FormFile

            await updateFormFile(initialFormMessage, formFile)

            await threadChannel.send(createQuestionMessage(formFile, 0))

            return await interaction.editReply(
              new MessageBuilder()
                .setEmbeds((embed) => {
                  return embed
                    .setColor("Primary")
                    .setTitle("Form created")
                    .setDescription(
                      "Your form has been created and is ready to be filled out.",
                    )
                })
                .setComponents((actionrow) => {
                  return actionrow
                    .addButton((button) => {
                      return button
                        .setURL(threadChannel.url)
                        .setLabel("Go to form")
                        .setStyle(ButtonStyle.Link)
                    })
                    .addButton((button) => {
                      const id = formCustomIds.delete(form.id, threadChannel.id)
                      return button
                        .setCustomId(id)
                        .setLabel("Delete form")
                        .setStyle(ButtonStyle.Danger)
                    })
                }),
            )
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
            const modalValueId = formCustomIds.acceptWithReasonValue(
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
            const modalValueId = formCustomIds.rejectWithReasonValue(
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
      const initialFormMessage = await getFormFileMessage(interactionMessage)

      if (!initialFormMessage) {
        return await interaction.reply(formErrors.formNotFound)
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

      if (interaction.isModalSubmit() && interaction.isFromMessage()) {
        const modalValueId = formCustomIds.input_modal_value
        const modalValue = interaction.fields.getTextInputValue(modalValueId)

        const { data, error, success } = validateValue(
          currentQuestion,
          modalValue,
        )

        if (!success) {
          return await interaction.reply(new BotErrorMessage(error.message))
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
