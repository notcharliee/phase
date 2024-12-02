import { AttachmentBuilder } from "discord.js"

import { z } from "zod"

import { parseHiddenContent } from "~/lib/utils/misc"

import type { Message } from "discord.js"

export const formFileSchema = z.object({
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
      choices: z.string().array().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
    }),
  ),
  responses: z.union([z.string(), z.number(), z.boolean(), z.null()]).array(),
})

export type FormFile = z.infer<typeof formFileSchema>

/**
 * Fetches the initial form message containing the form file.
 *
 * @param message The question message containing hidden content.
 * @returns The initial form message.
 */
export async function getFormFileMessage(message: Message) {
  const threadChannel = message.channel
  const initialMessageId = parseHiddenContent(message.content)!

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
export async function getFormFile(message: Message) {
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
export function updateFormFile(
  initialFormMessage: Message,
  formFile: FormFile,
) {
  return initialFormMessage.edit({
    content: "You can ignore this file, it's just here to hold your responses.",
    files: [
      new AttachmentBuilder(Buffer.from(JSON.stringify(formFile, null, 2)), {
        name: "form_responses", // omit the file extension to avoid discord's file preview on desktop
      }),
    ],
  })
}
