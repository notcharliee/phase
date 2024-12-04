import { redirect } from "next/navigation"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { ModuleId } from "@repo/utils/modules"

import { connectDB } from "~/lib/db"
import { env } from "~/lib/env"
import { twitchClient } from "~/lib/twitch"
import { deleteKeyRecursively } from "~/lib/utils"

import type { RESTAPIGuildChannelResolvable } from "@discordjs/core/http-only"
import type { DashboardData, GuildModulesWithData } from "~/types/dashboard"

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

  // remove @everyone role
  apiGuild.roles = apiGuild.roles.filter((role) => role.id !== guildId)

  const apiChannels = (await discordAPI.guilds.getChannels(
    guildId,
  )) as RESTAPIGuildChannelResolvable[]

  // add required `_data` values to modules

  const guildModules = deleteKeyRecursively(
    dbGuild.modules ? (dbGuild.toObject().modules as GuildModulesWithData) : {},
    "_id",
  )

  if (guildModules[ModuleId.TwitchNotifications]) {
    const guildModule = guildModules[ModuleId.TwitchNotifications]
    const streamerNames: string[] = []

    for (const streamer of guildModule.streamers) {
      const user = await twitchClient.users.getUserById(streamer.id)
      if (user) streamerNames.push(user.name)
    }

    guildModule._data = { streamerNames }
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
