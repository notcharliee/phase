"use server"

import { NextRequest } from "next/server"

import { POST as postTwitchApiRoute } from "@/app/api/twitch/route"
import {
  API,
  MessageType,
  type APIMessage,
  type RESTPostAPIChannelMessageJSONBody,
} from "@discordjs/core/http-only"
import { REST, type RawFile } from "@discordjs/rest"
import {
  GuildSchema,
  ReminderSchema,
  type GuildModules,
  type Reminder,
} from "@repo/schemas"
import { ApiClient } from "@twurple/api"
import { AppTokenAuthProvider } from "@twurple/auth"

import { modulesConfig } from "@/config/modules"

import { env } from "@/lib/env"
import { absoluteURL } from "@/lib/utils"

import { getAuthCredentials, getUser } from "../../_cache/user"
import { type FormValues as AutoMessagesFormValues } from "./_forms/auto-messages"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

/**
 * @param moduleName The name of the module.
 * @param moduleData The data to update.
 */
export const updateModule = async <TName extends keyof GuildModules>(
  moduleName: TName,
  moduleData: Partial<Partial<GuildModules>[TName]>,
) => {
  const { guild } = await getUser(...getAuthCredentials())

  const moduleExists = modulesConfig.some((module) => {
    const moduleKey = module.name
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replaceAll(" ", "")

    return moduleKey === moduleName
  })

  if (!moduleExists) throw new Error("Invalid module name")

  await GuildSchema.findByIdAndUpdate(guild.document_id, {
    modules: {
      ...guild.modules,
      [moduleName]: {
        ...guild.modules?.[moduleName],
        ...moduleData,
      },
    },
  })
}

export const updateModuleMessage = async (
  channelId: string,
  oldMessage: APIMessage | undefined,
  {
    files,
    ...body
  }: RESTPostAPIChannelMessageJSONBody & { files?: RawFile[] | undefined },
) => {
  await getUser(...getAuthCredentials())

  if (oldMessage)
    await discordAPI.channels
      .deleteMessage(oldMessage.channel_id, oldMessage.id)
      .catch(() => null)

  const message = await discordAPI.channels.createMessage(channelId, {
    files,
    ...body,
  })

  await discordAPI.channels.pinMessage(channelId, message.id)

  const pinMessage = (
    await discordAPI.channels.getMessages(channelId, {
      after: message.id,
      limit: 1,
    })
  ).at(0)

  if (pinMessage && pinMessage.type === MessageType.ChannelPinnedMessage) {
    await discordAPI.channels
      .deleteMessage(channelId, pinMessage.id)
      .catch(() => null)
  }

  return message
}

export const updateReactions = async (
  channelId: string,
  messageId: string,
  emojis: string[],
) => {
  await getUser(...getAuthCredentials())

  await discordAPI.channels.deleteAllMessageReactions(channelId, messageId)

  for (const emoji of emojis) {
    await discordAPI.channels.addMessageReaction(channelId, messageId, emoji)
  }
}

export const addAutoMessages = async (formValues: AutoMessagesFormValues) => {
  const { user, guild } = await getUser(...getAuthCredentials())

  const userId = user.id
  const guildId = guild.id

  const messages = formValues.messages.map((message) => ({
    name: message.name,
    channel: message.channel,
    message: message.message,
    mention: message.mention,
    interval: +message.interval,
  }))

  await updateModule("AutoMessages", {
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

  await ReminderSchema.deleteMany({
    guild: guildId,
    loop: true,
  })

  await ReminderSchema.insertMany(documents)
}

export const getTwitchUserByName = async (username: string) => {
  const authProvider = new AppTokenAuthProvider(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET,
  )

  const twitchClient = new ApiClient({
    authProvider,
  })

  try {
    const user = await twitchClient.users.getUserByName(username)

    const result = user
      ? {
          id: user.id,
          name: user.name,
          displayName: user.displayName,
        }
      : undefined

    return result
  } catch (error) {
    return undefined
  }
}

export const getTwitchUserById = async (id: string) => {
  const authProvider = new AppTokenAuthProvider(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET,
  )

  const twitchClient = new ApiClient({
    authProvider,
  })

  try {
    const user = await twitchClient.users.getUserById(id)

    const result = user
      ? {
          id: user.id,
          name: user.name,
          displayName: user.displayName,
        }
      : undefined

    return result
  } catch (error) {
    return undefined
  }
}

export const addChannelSubscription = async (channelId: string) => {
  const request = new NextRequest(absoluteURL("/api/twitch"), {
    body: JSON.stringify({ channelId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.TWITCH_CLIENT_SECRET}`,
    },
    method: "POST",
  })

  const response = await postTwitchApiRoute(request)

  return response.status
}
