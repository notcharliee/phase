"use server"

import { NextRequest } from "next/server"

import { API, ButtonStyle, MessageType } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { StatusCodes } from "http-status-codes"

import { database } from "~/lib/db"
import { env } from "~/lib/env"
import { twitchClient } from "~/lib/twitch"
import { absoluteURL } from "~/lib/utils"

import { POST as postTwitchApiRoute } from "~/app/api/twitch/route"
import { getDasbboardHeaders } from "~/app/dashboard/utils"

import type {
  APIButtonComponentWithCustomId,
  APIMessage,
  RESTPostAPIChannelMessageJSONBody,
} from "@discordjs/core/http-only"
import type { GuildModules, Reminder } from "~/lib/db"
import type { GuildModulesWithData } from "~/types/dashboard"
import type {
  autoMessagesSchema,
  formsSchema,
  reactionRolesSchema,
  ticketsSchema,
  twitchNotificationsSchema,
} from "~/validators/modules"
import type { z } from "zod"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

/**
 * This server action is used to update module data in the database. Make sure this server action is only exposed in dashboard routes so it goes through the right middleware. If the `x-guild-id` and `x-user-id` headers are not found, or if the found member is unauthorised, the action will throw an error.
 *
 * @param name The name of the module
 * @param data The new module data
 * @returns The updated guild document
 */
export const updateModule = async <T extends keyof GuildModules>(
  name: T,
  data: GuildModules[T],
) => {
  const { guildId, userId } = getDasbboardHeaders()

  const db = await database.init()

  const guildDoc = await db.guilds.findOne({
    id: guildId,
    admins: { $in: userId },
  })

  if (!guildDoc) {
    throw new Error(
      `Could not find guild by id '${guildId}' with admin by id '${userId}'`,
    )
  }

  if (data && "_data" in data) {
    delete data._data
  }

  await guildDoc.updateOne({
    modules: {
      ...(guildDoc.toObject().modules ?? {}),
      [name]: data,
    },
  })

  const updatedModuleData = {
    _data: {},
    ...data,
  } as Required<GuildModulesWithData>[T]

  return updatedModuleData
}

export const updateAutoMessages = async (
  formValues: z.infer<typeof autoMessagesSchema>,
) => {
  const { guildId, userId } = getDasbboardHeaders()

  const messages = formValues.messages.map((message) => ({
    name: message.name,
    channel: message.channel,
    message: message.message,
    mention: message.mention,
    interval: +message.interval,
  }))

  const updatedModuleData = await updateModule("AutoMessages", {
    ...formValues,
    messages,
  })

  const documents: Reminder[] = []

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]!

    documents.push({
      guild: guildId,
      name: message.name,
      message: message.message,
      channel: message.channel,
      time: message.interval,
      loop: true,
      user: userId,
      role: message.mention,
      created: formValues.messages[i]!.startAt ?? new Date(),
      unsent: true,
    })
  }

  const db = await database.init()

  await db.reminders.deleteMany({
    guild: guildId,
    loop: true,
  })

  await db.reminders.insertMany(documents)

  return updatedModuleData
}

export const updateForms = async (formValues: z.infer<typeof formsSchema>) => {
  const data: GuildModules["Forms"] = {
    ...formValues,
    forms: formValues.forms.map((form) => ({
      ...form,
      questions: form.questions.map((q) => q.question),
    })),
  }

  const updatedModuleData = await updateModule("Forms", data)

  const existingMessages = (
    await Promise.all(
      data.forms.map(async (form) => {
        const pins = (
          await discordAPI.channels.getPins(form.channel).catch(() => [])
        ).filter((pin) => pin.author.id === env.DISCORD_ID)

        return pins[0]
      }),
    )
  ).filter(Boolean) as APIMessage[]

  const updatedMessages: APIMessage[] = []

  for (const form of data.forms) {
    const formId = form.id
    const channelId = form.channel

    const existingMessage = existingMessages.find((message) => {
      const button = message.components?.at(0)?.components[0] as
        | APIButtonComponentWithCustomId
        | undefined

      if (button?.custom_id.endsWith(formId)) return true
    })

    const newMessageBody = {
      components: [
        {
          components: [
            {
              custom_id: `form.start.${formId}`,
              label: form.name,
              style: ButtonStyle.Secondary,
              type: 2,
            },
          ],
          type: 1,
        },
      ],
      embeds: [
        {
          color: parseInt("f8f8f8", 16),
          title: `${form.name}`,
          description: `Press the button below to start filling out the form.`,
          footer: {
            text: `${form.questions.length} questions in total.`,
          },
        },
      ],
    } satisfies RESTPostAPIChannelMessageJSONBody

    if (existingMessage) {
      const newMessage = await discordAPI.channels.editMessage(
        channelId,
        existingMessage.id,
        newMessageBody,
      )

      updatedMessages.push(newMessage)
    } else {
      const newMessage = await discordAPI.channels.createMessage(
        channelId,
        newMessageBody,
      )

      await discordAPI.channels.pinMessage(channelId, newMessage.id)

      const pinNotification = (
        await discordAPI.channels.getMessages(channelId, {
          after: newMessage.id,
          limit: 1,
        })
      ).at(0)

      if (
        pinNotification &&
        pinNotification.type === MessageType.ChannelPinnedMessage
      ) {
        await discordAPI.channels
          .deleteMessage(channelId, pinNotification.id)
          .catch(() => null)
      }

      updatedMessages.push(newMessage)
    }
  }

  updatedModuleData._data.messages = updatedMessages

  return updatedModuleData
}

export const updateReactionRoles = async (
  formValues: z.infer<typeof reactionRolesSchema>,
) => {
  const [, channelId, messageId] = formValues.messageUrl
    .replace("https://discord.com/channels/", "")
    .split("/") as [string, string, string]

  const data: GuildModules["ReactionRoles"] = {
    enabled: formValues.enabled,
    channel: channelId,
    message: messageId,
    reactions: formValues.reactions,
  }

  const updatedModuleData = await updateModule("ReactionRoles", data)

  await discordAPI.channels.deleteAllMessageReactions(channelId, messageId)

  for (const { emoji } of data.reactions) {
    await discordAPI.channels.addMessageReaction(channelId, messageId, emoji)
  }

  return updatedModuleData
}

export const updateTickets = async (
  formValues: z.infer<typeof ticketsSchema>,
) => {
  const data: GuildModules["Tickets"] = {
    ...formValues,
  }

  const updatedModuleData = await updateModule("Tickets", data)

  const existingMessage = (
    await discordAPI.channels.getPins(data.channel).catch(() => [])
  ).filter((pin) => pin.author.id === env.DISCORD_ID)[0]

  let updatedMessage: APIMessage | undefined = undefined

  const newMessageBody = {
    components: [
      {
        components: data.tickets.map((ticket) => ({
          custom_id: `ticket.open.${ticket.id}`,
          label: ticket.name,
          style: ButtonStyle.Secondary,
          type: 2,
        })),
        type: 1,
      },
    ],
    embeds: [
      {
        color: parseInt("f8f8f8", 16),
        title: "Make a ticket 🎫",
        description: formValues.message,
      },
    ],
  } satisfies RESTPostAPIChannelMessageJSONBody

  if (existingMessage) {
    const newMessage = await discordAPI.channels.editMessage(
      data.channel,
      existingMessage.id,
      newMessageBody,
    )

    updatedMessage = newMessage
  } else {
    const newMessage = await discordAPI.channels.createMessage(
      data.channel,
      newMessageBody,
    )

    await discordAPI.channels.pinMessage(data.channel, newMessage.id)

    const pinNotification = (
      await discordAPI.channels.getMessages(data.channel, {
        after: newMessage.id,
        limit: 1,
      })
    ).at(0)

    if (
      pinNotification &&
      pinNotification.type === MessageType.ChannelPinnedMessage
    ) {
      await discordAPI.channels
        .deleteMessage(data.channel, pinNotification.id)
        .catch(() => null)
    }

    updatedMessage = newMessage
  }

  updatedModuleData._data.message = updatedMessage

  return updatedModuleData
}

export const updateTwitchNotifications = async (
  formValues: z.infer<typeof twitchNotificationsSchema>,
) => {
  const data: GuildModules["TwitchNotifications"] = {
    ...formValues,
    streamers: await Promise.all(
      formValues.streamers.map(async (streamer) => {
        const { id } = (await twitchClient.users.getUserByName(streamer.id))!

        return {
          ...streamer,
          id,
        }
      }),
    ),
  }

  const updatedModuleData = await updateModule("TwitchNotifications", data)

  for (const { id } of data.streamers) {
    const request = new NextRequest(absoluteURL("/api/twitch"), {
      body: JSON.stringify({ channelId: id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.TWITCH_CLIENT_SECRET}`,
      },
      method: "POST",
    })

    const response = await postTwitchApiRoute(request)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (response.status !== StatusCodes.NO_CONTENT) {
      throw new Error("An error occured")
    }
  }

  updatedModuleData._data.streamerNames = formValues.streamers.map(
    (streamer) => streamer.id,
  )

  return updatedModuleData
}
