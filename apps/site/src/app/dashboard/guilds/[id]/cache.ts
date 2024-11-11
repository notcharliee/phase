import { redirect } from "next/navigation"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { ModuleId } from "@repo/utils/modules"

import { connectDB } from "~/lib/db"
import { env } from "~/lib/env"
import { twitchClient } from "~/lib/twitch"
import { deleteKeyRecursively } from "~/lib/utils"

import type { RESTAPIGuildChannelResolvable } from "@discordjs/core/http-only"
import type {
  DashboardData,
  GuildModulesWithData,
  ModulesDataFields,
} from "~/types/dashboard"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

interface GuildDataParams {
  guildId: string
  userId: string
}

export const getGuildData = async (params: GuildDataParams) => {
  const { guildId, userId } = params

  const db = await connectDB()

  const dbGuild = await db.guilds.findOne({
    id: guildId,
    admins: { $in: userId },
  })

  if (!dbGuild) {
    redirect("/dashboard/guilds")
  }

  const apiGuild = await discordAPI.guilds
    .get(guildId, { with_counts: false })
    .catch(() => null)

  if (!apiGuild) {
    redirect("/dashboard/guilds")
  }

  const apiChannels = (await discordAPI.guilds.getChannels(
    guildId,
  )) as RESTAPIGuildChannelResolvable[]

  // add required `_data` values to modules

  const guildModules = deleteKeyRecursively(
    dbGuild.modules ? (dbGuild.toObject().modules as GuildModulesWithData) : {},
    "_id",
  )

  const guildModuleIdsWithDataFields = [
    ModuleId.Forms,
    ModuleId.Tickets,
    ModuleId.TwitchNotifications,
  ] as const

  for (const guildModuleId of guildModuleIdsWithDataFields) {
    if (guildModules[guildModuleId]) {
      guildModules[guildModuleId]._data =
        {} as ModulesDataFields[typeof guildModuleId]
    }
  }

  if (guildModules[ModuleId.Forms]) {
    const guildModule = guildModules[ModuleId.Forms]

    guildModule._data.messages = []

    for (const form of guildModule.forms) {
      const channel = apiChannels.find(({ id }) => id === form.channel)
      const pins = channel ? await discordAPI.channels.getPins(channel.id) : []
      const message = pins.find((pin) => pin.author.id === env.DISCORD_ID)

      if (message) guildModule._data.messages.push(message)
    }
  }

  if (guildModules[ModuleId.Tickets]) {
    const guildModule = guildModules[ModuleId.Tickets]

    const channel = apiChannels.find(({ id }) => id === guildModule.channel)
    const pins = channel ? await discordAPI.channels.getPins(channel.id) : []
    const message = pins.find((pin) => pin.author.id === env.DISCORD_ID)

    guildModule._data.messageContent = message?.embeds[0]?.description
  }

  if (guildModules[ModuleId.TwitchNotifications]) {
    const guildModule = guildModules[ModuleId.TwitchNotifications]

    guildModule._data.streamerNames = []

    for (const streamer of guildModule.streamers) {
      const user = await twitchClient.users.getUserById(streamer.id)
      if (user) guildModule._data.streamerNames.push(user.name)
    }
  }

  const guildData: DashboardData["guild"] = {
    ...apiGuild,
    channels: apiChannels,
    admins: dbGuild.admins,
    commands: Object.fromEntries(dbGuild.commands ?? []),
    modules: guildModules,
  }

  return guildData
}
