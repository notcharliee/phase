import {
  API,
  ButtonStyle,
  ComponentType,
  MessageType,
} from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"
import { env } from "~/lib/env"
import { twitchClient } from "~/lib/twitch"
import { createHiddenContent, parseHiddenContent, safeMs } from "~/lib/utils"

import type {
  APIButtonComponentWithCustomId,
  APIMessage,
  RESTPostAPIChannelMessageJSONBody,
} from "@discordjs/core/http-only"
import type { ModulesFormValuesOutput } from "~/types/dashboard"
import type { GuildModules, mongoose, Reminder } from "~/types/db"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export async function parseModuleData(
  moduleId: ModuleId,
  formData: ModulesFormValuesOutput[ModuleId],
): Promise<GuildModules[ModuleId] | undefined> {
  const formDataIs = <T extends ModuleId>(
    id: T,
    data: ModulesFormValuesOutput[keyof ModulesFormValuesOutput],
  ): data is Required<ModulesFormValuesOutput>[T] => {
    return id === moduleId && data !== undefined
  }

  if (formDataIs(ModuleId.AutoMessages, formData)) {
    return {
      ...formData,
      messages: formData.messages.map((message) => ({
        name: message.name,
        channel: message.channel,
        message: message.content,
        mention: message.mention,
        interval: safeMs(message.interval)!,
      })),
    }
  }

  if (formDataIs(ModuleId.BumpReminders, formData)) {
    return {
      ...formData,
      time: safeMs(formData.time)!,
    }
  }

  if (formDataIs(ModuleId.Levels, formData)) {
    const { replyType: _, ...rest } = formData
    return rest
  }

  if (formDataIs(ModuleId.ReactionRoles, formData)) {
    const [, channelId, messageId] = formData.messageUrl
      .replace("https://discord.com/channels/", "")
      .split("/") as [string, string, string]

    return {
      enabled: formData.enabled,
      channel: channelId,
      message: messageId,
      reactions: formData.reactions,
    }
  }

  if (formDataIs(ModuleId.SelfRoles, formData)) {
    return {
      ...formData,
      messages: formData.messages.map((message) => ({
        ...message,
        methods: message.methods.map(
          ({ rolesToAdd, rolesToRemove, ...method }) => ({
            ...method,
            roles: [
              ...rolesToAdd.map((id) => ({
                id,
                action: "add" as const,
              })),
              ...rolesToRemove.map((id) => ({
                id,
                action: "remove" as const,
              })),
            ],
          }),
        ),
      })) as GuildModules[ModuleId.SelfRoles]["messages"],
    }
  }

  if (formDataIs(ModuleId.TwitchNotifications, formData)) {
    return {
      ...formData,
      streamers: await Promise.all(
        formData.streamers.map(async (streamer) => {
          const user = await twitchClient.users
            .getUserByName(streamer.id)
            .catch(() => null)

          if (!user) {
            throw new Error(
              `Could not find a user under the name '${streamer.id}'`,
            )
          }

          return {
            ...streamer,
            id: user.id,
          }
        }),
      ),
    }
  }

  if (formDataIs(ModuleId.Warnings, formData)) {
    return {
      ...formData,
      warnings: formData.warnings.map((role) => role.role),
    }
  }

  return formData
}

export async function handleAutoMessagesModule(
  guildId: string,
  messages: GuildModules[ModuleId.AutoMessages]["messages"],
) {
  const docsToInsert: mongoose.Document<unknown, {}, Reminder>[] = []

  for (const message of messages) {
    docsToInsert.push(
      new db.reminders({
        name: message.name,
        guild: guildId,
        channel: message.channel,
        content: message.message,
        mention: message.mention,
        delay: message.interval,
        loop: true,
      }),
    )
  }

  await db.connect(env.MONGODB_URI)

  await db.reminders.bulkWrite([
    { deleteMany: { filter: { guild: guildId, loop: true } } },
    ...docsToInsert.map((doc) => ({ insertOne: { document: doc } })),
  ])
}

export async function handleFormsModule(
  forms: GuildModules[ModuleId.Forms]["forms"],
): Promise<APIMessage[]> {
  const updatedMessages: APIMessage[] = []

  const existingMessages = (
    await Promise.all(
      forms.map(async (form) => {
        const pins = (
          await discordAPI.channels.getPins(form.channel).catch(() => [])
        ).filter((pin) => pin.author.id === env.DISCORD_ID)

        return pins[0]
      }),
    )
  ).filter(Boolean)

  for (const form of forms) {
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

    let newMessage: APIMessage

    if (existingMessage) {
      newMessage = await discordAPI.channels.editMessage(
        channelId,
        existingMessage.id,
        newMessageBody,
      )
    } else {
      newMessage = await discordAPI.channels.createMessage(
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
    }

    updatedMessages.push(newMessage)
  }

  return updatedMessages
}

export async function handleReactionRolesModule(
  channelId: string,
  messageId: string,
  reactions: GuildModules[ModuleId.ReactionRoles]["reactions"],
) {
  await discordAPI.channels.deleteAllMessageReactions(channelId, messageId)

  for (const { emoji } of reactions) {
    await discordAPI.channels.addMessageReaction(channelId, messageId, emoji)
  }
}

export async function handleSelfRolesModule(
  messages: GuildModules[ModuleId.SelfRoles]["messages"],
) {
  for (const message of messages) {
    const existingMessage = (
      await discordAPI.channels.getPins(message.channel).catch(() => [])
    ).find(
      (pin) =>
        pin.author.id === env.DISCORD_ID &&
        pin.embeds[0]?.description &&
        parseHiddenContent(pin.embeds[0].description) === message.id,
    )

    const newMessageBody = {
      embeds: [
        {
          color: parseInt("f8f8f8", 16),
          title: message.name,
          description: message.content + " " + createHiddenContent(message.id),
        },
      ],
      components:
        message.type === "button"
          ? [
              {
                type: ComponentType.ActionRow,
                components: message.methods.map((method) => ({
                  type: ComponentType.Button,
                  style: ButtonStyle.Secondary,
                  custom_id: `selfroles.${message.id}.button.${method.id}`,
                  label: method.label,
                  emoji: method.emoji ? { name: method.emoji } : undefined,
                })),
              },
            ]
          : message.type === "dropdown"
            ? [
                {
                  type: ComponentType.ActionRow,
                  components: [
                    {
                      type: ComponentType.StringSelect,
                      custom_id: `selfroles.${message.id}.dropdown`,
                      options: message.methods.map((method) => ({
                        label: method.label,
                        value: method.id,
                        emoji: method.emoji
                          ? { name: method.emoji }
                          : undefined,
                      })),
                    },
                  ],
                },
              ]
            : undefined,
    } satisfies RESTPostAPIChannelMessageJSONBody

    if (existingMessage) {
      await discordAPI.channels.editMessage(
        message.channel,
        existingMessage.id,
        newMessageBody,
      )

      if (message.type === "reaction") {
        const existingReactions = existingMessage.reactions ?? []
        const newReactions = message.methods.map((method) => method.emoji)

        const reactionsToAdd = newReactions.filter(
          (reaction) =>
            !existingReactions.find(
              (existingReaction) => existingReaction.emoji.name === reaction,
            ),
        )

        const reactionsToRemove = existingReactions.filter(
          (reaction) => !newReactions.includes(reaction.emoji.name!),
        )

        if (reactionsToAdd.length) {
          for (const reaction of reactionsToAdd) {
            void discordAPI.channels.addMessageReaction(
              message.channel,
              existingMessage.id,
              reaction,
            )
          }
        }

        if (reactionsToRemove.length) {
          for (const reaction of reactionsToRemove) {
            void discordAPI.channels.deleteAllMessageReactionsForEmoji(
              message.channel,
              existingMessage.id,
              reaction.emoji.name!,
            )
          }
        }
      }
    } else {
      const discordMessage = await discordAPI.channels.createMessage(
        message.channel,
        newMessageBody,
      )

      if (message.type === "reaction") {
        for (const method of message.methods) {
          void discordAPI.channels.addMessageReaction(
            message.channel,
            discordMessage.id,
            method.emoji,
          )
        }
      }

      await discordAPI.channels.pinMessage(message.channel, discordMessage.id)

      const pinNotification = (
        await discordAPI.channels.getMessages(message.channel, {
          after: discordMessage.id,
          limit: 1,
        })
      ).at(0)

      if (
        pinNotification &&
        pinNotification.type === MessageType.ChannelPinnedMessage
      ) {
        await discordAPI.channels
          .deleteMessage(message.channel, pinNotification.id)
          .catch(() => null)
      }
    }
  }
}

export async function handleTicketsModule(
  channelId: string,
  tickets: GuildModules[ModuleId.Tickets]["tickets"],
  message?: string,
) {
  const existingMessage = (
    await discordAPI.channels.getPins(channelId).catch(() => [])
  ).find((pin) => pin.author.id === env.DISCORD_ID)

  const body = {
    components: [
      {
        components: tickets.map((ticket) => ({
          label: ticket.name,
          custom_id: `ticket.open.${ticket.id}`,
          style: ButtonStyle.Secondary,
          type: ComponentType.Button,
        })),
        type: ComponentType.ActionRow,
      },
    ],
    embeds: [
      {
        color: parseInt("f8f8f8", 16),
        title: "Make a ticket 🎫",
        description: message,
      },
    ],
  } satisfies RESTPostAPIChannelMessageJSONBody

  if (existingMessage) {
    await discordAPI.channels.editMessage(channelId, existingMessage.id, body)
  } else {
    const message = await discordAPI.channels.createMessage(channelId, body)

    await discordAPI.channels.pinMessage(channelId, message.id)

    const pinNotification = (
      await discordAPI.channels.getMessages(channelId, {
        after: message.id,
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
  }
}
