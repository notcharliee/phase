import {
  API,
  ButtonStyle,
  ComponentType,
  MessageType,
} from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { ModuleId } from "@repo/config/phase/modules.ts"

import { db } from "~/lib/db"
import { env } from "~/lib/env"
import { twitchClient } from "~/lib/twitch"
import { createHiddenContent, safeMs } from "~/lib/utils"

import type {
  APIButtonComponentWithCustomId,
  APIMessage,
  APIStringSelectComponent,
  RESTPostAPIChannelMessageJSONBody,
} from "@discordjs/core/http-only"
import type { ModulesFormValues } from "~/types/dashboard"
import type { GuildModules, mongoose, Reminder } from "~/types/db"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export async function parseModuleData(
  moduleId: ModuleId,
  formData: ModulesFormValues[ModuleId],
): Promise<GuildModules[ModuleId] | undefined> {
  const formDataIs = <T extends ModuleId>(
    id: T,
    data: ModulesFormValues[keyof ModulesFormValues],
  ): data is Required<ModulesFormValues>[T] => {
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
  ).filter(Boolean) as APIMessage[]

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
    ).find((pin) => pin.author.id === env.DISCORD_ID)

    type ReactionBasedMethod = Extract<
      (typeof message.methods)[number],
      { type: "reaction" }
    >

    type InteractionBasedMethod = Extract<
      (typeof message.methods)[number],
      { type: "button" | "dropdown" }
    >

    const isReactionBased = (
      methods: typeof message.methods,
    ): methods is ReactionBasedMethod[] =>
      methods.every((method) => method.type === "reaction")

    const isInteractionBased = (
      methods: typeof message.methods,
    ): methods is InteractionBasedMethod[] =>
      methods.every((method) => method.type !== "reaction")

    const newMessageBody = {
      content: createHiddenContent(message.id),
      embeds: [
        {
          color: parseInt("f8f8f8", 16),
          title: message.name,
          description: message.content,
        },
      ],
      components: isInteractionBased(message.methods)
        ? [
            {
              type: ComponentType.ActionRow,
              components: message.methods.flatMap((method) =>
                method.type === "button"
                  ? ({
                      type: ComponentType.Button,
                      style: ButtonStyle.Secondary,
                      custom_id: `selfroles.${message.id}.button.${method.id}`,
                      label: method.label,
                      emoji: method.emoji ? { name: method.emoji } : undefined,
                    } satisfies APIButtonComponentWithCustomId)
                  : ({
                      type: ComponentType.StringSelect,
                      custom_id: `selfroles.${message.id}.dropdown.${method.id}`,
                      placeholder: method.placeholder,
                      max_values: method.multiselect ? 25 : 1,
                      options: method.options.map((option) => ({
                        label: option.label,
                        value: option.id,
                        emoji: option.emoji
                          ? { name: option.emoji }
                          : undefined,
                      })),
                    } satisfies APIStringSelectComponent),
              ),
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

      if (isReactionBased(message.methods)) {
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

      if (isReactionBased(message.methods)) {
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
  message: string,
): Promise<APIMessage> {
  const existingMessage = (
    await discordAPI.channels.getPins(channelId).catch(() => [])
  ).find((pin) => pin.author.id === env.DISCORD_ID)

  const newMessageBody = {
    components: [
      {
        components: tickets.map((ticket) => ({
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
        description: message,
      },
    ],
  } satisfies RESTPostAPIChannelMessageJSONBody

  let updatedMessage: APIMessage

  if (existingMessage) {
    updatedMessage = await discordAPI.channels.editMessage(
      channelId,
      existingMessage.id,
      newMessageBody,
    )
  } else {
    updatedMessage = await discordAPI.channels.createMessage(
      channelId,
      newMessageBody,
    )

    await discordAPI.channels.pinMessage(channelId, updatedMessage.id)

    const pinNotification = (
      await discordAPI.channels.getMessages(channelId, {
        after: updatedMessage.id,
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

  return updatedMessage
}
