import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"

import { truncateString } from "~/lib/utils/formatting"
import { createHiddenContent } from "~/lib/utils/misc"

import { formCustomIds } from "~/app/events/(modules)/forms/_utils"
import { MessageBuilder } from "~/structures/builders"

import type { FormFile } from "./_form"

export type FormQuestion = FormFile["questions"][number]

/**
 * Creates a question message for the form.
 *
 * @param formFile The form file.
 * @param questionIndex The index of the question.
 * @returns The question message object.
 */
export function createQuestionMessage(
  formFile: FormFile,
  questionIndex: number,
) {
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
    .setCustomId(formCustomIds.input_button_skip)
    .setLabel("Skip")
    .setStyle(ButtonStyle.Secondary)

  const message = new MessageBuilder()
    .setContent(createHiddenContent(formFile.metadata.initialMessageId))
    .setEmbeds((embed) => {
      return embed
        .setColor("Primary")
        .setTitle(title)
        .setDescription(description)
        .setFooter(footer)
    })

  if (currentQuestion.choices) {
    message.setComponents((actionrow) => {
      return actionrow.addStringSelectMenu((selectmenu) => {
        return selectmenu
          .setCustomId(formCustomIds.input_select)
          .setPlaceholder("Select an option")
          .setMaxValues(1)
          .setMinValues(1)
          .setOptions(
            currentQuestion.choices!.map((choice, index) =>
              new StringSelectMenuOptionBuilder()
                .setLabel(truncateString(choice, 100))
                .setValue(index.toString()),
            ),
          )
      })
    })
  } else if (currentQuestion.type === "boolean") {
    message.setComponents((actionrow) => {
      return actionrow.addComponents(
        new ButtonBuilder()
          .setCustomId(formCustomIds.input_button_yes)
          .setLabel("Yes")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(formCustomIds.input_button_no)
          .setLabel("No")
          .setStyle(ButtonStyle.Secondary),
        ...(!currentQuestion.required ? [skipButton] : []),
      )
    })
  } else {
    message.setComponents((actionrow) => {
      return actionrow.addComponents(
        new ButtonBuilder()
          .setCustomId(formCustomIds.input_modal_trigger)
          .setLabel("Open modal")
          .setStyle(ButtonStyle.Secondary),
        ...(!currentQuestion.required ? [skipButton] : []),
      )
    })
  }

  return message.toJSON()
}

/**
 * Creates a question input modal for the form.
 *
 * @param question The question schema.
 * @returns The modal.
 */
export function createQuestionInputModal(question: FormQuestion) {
  const modalInputStyle =
    question.type === "string" ? TextInputStyle.Paragraph : TextInputStyle.Short

  const modalInput = new TextInputBuilder()
    .setCustomId(formCustomIds.input_modal_value)
    .setLabel(truncateString(question.label, 45))
    .setMinLength(question.min ?? 1)
    .setMaxLength(question.max ?? 256)
    .setStyle(modalInputStyle)
    .setRequired(true)

  const modal = new ModalBuilder()
    .setCustomId(formCustomIds.input_modal)
    .setTitle(truncateString(question.label, 45))
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(modalInput),
    )

  return modal
}
