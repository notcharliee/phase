import { headers as getHeaders } from "next/headers"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { GuildSchema } from "@repo/schemas"
import cloneDeep from "lodash.clonedeep"

import { DashboardProvider } from "~/components/dashboard/context"

import { dbConnect } from "~/lib/db"
import { env } from "~/lib/env"
import { twitchClient } from "~/lib/twitch"

import type { DashboardData, GuildModulesWithData } from "@/types/dashboard"
import type {
  APIGuildChannel,
  APIMessage,
  GuildChannelType,
} from "@discordjs/core/http-only"
import type { GuildModules } from "@repo/schemas"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export default async function Template({
  children,
}: {
  children: React.ReactNode
}) {
  const headers = getHeaders()

  const guildId = headers.get("x-guild-id")
  const userId = headers.get("x-user-id")

  if (!guildId || !userId) throw new Error("Invalid credentials")

  await dbConnect()

  const dbGuild = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  }).catch(() => null)

  if (!dbGuild) throw new Error("Guild not found in the database")

  const apiGuild = await discordAPI.guilds
    .get(guildId, { with_counts: true })
    .catch(() => {
      throw new Error("Guild not found")
    })

  const apiChannels = (await discordAPI.guilds.getChannels(
    guildId,
  )) as APIGuildChannel<GuildChannelType>[]

  // Add required data to modules

  const guildModules = (
    dbGuild.modules ? cloneDeep(dbGuild.modules) : {}
  ) as GuildModulesWithData

  for (const guildModuleKey of Object.keys(
    guildModules,
  ) as (keyof GuildModules)[]) {
    const guildModule = guildModules[guildModuleKey]
    guildModule!._data = {}
  }

  if (guildModules.Forms) {
    const guildModule = guildModules.Forms

    guildModule._data.messages = (
      await Promise.all(
        guildModule.forms.map(async (form) => {
          if (apiChannels.find((channel) => channel.id === form.channel)) {
            const pins = (
              await discordAPI.channels.getPins(form.channel)
            ).filter((pin) => pin.author.id === env.DISCORD_ID)

            return pins[0]
          }
        }),
      )
    ).filter(Boolean) as APIMessage[]
  }

  if (guildModules.Tickets) {
    const guildModule = guildModules.Tickets

    guildModule._data.message =
      apiChannels.find((c) => c.id === guildModule.channel) &&
      (await discordAPI.channels.getPins(guildModule.channel)).filter(
        (pin) => pin.author.id === env.DISCORD_ID,
      )[0]
  }

  if (guildModules.TwitchNotifications) {
    const guildModule = guildModules.TwitchNotifications

    guildModule._data.streamerNames = []

    for (const streamer of guildModule.streamers) {
      const user = await twitchClient.users.getUserById(streamer.id)
      if (user) guildModule._data.streamerNames.push(user.name)
    }
  }

  const dashboardData: DashboardData = {
    _id: dbGuild._id.toString(),
    guild: {
      ...apiGuild,
      channels: apiChannels,
      admins: dbGuild.admins,
      commands: dbGuild.commands,
      modules: guildModules,
    },
  }

  return <DashboardProvider value={dashboardData}>{children}</DashboardProvider>
}
