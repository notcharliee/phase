import { headers as getHeaders } from "next/headers"
import { cache } from "react"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { ModuleId } from "@repo/config/phase/modules.ts"

import { ClientOnly } from "~/components/client-only"
import { DashboardProvider } from "~/components/dashboard/context"

import { db } from "~/lib/db"
import { env } from "~/lib/env"
import { twitchClient } from "~/lib/twitch"
import { deleteKeyRecursively } from "~/lib/utils"

import type {
  APIGuildChannel,
  APIMessage,
  GuildChannelType,
} from "@discordjs/core/http-only"
import type { DashboardData, GuildModulesWithData } from "~/types/dashboard"
import type { GuildModules } from "~/types/db"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

const getDashboardData = cache(async () => {
  const headers = getHeaders()

  const guildId = headers.get("x-guild-id")
  const userId = headers.get("x-user-id")

  if (!guildId || !userId) throw new Error("Invalid credentials")

  await db.connect(env.MONGODB_URI)

  const dbGuild = await db.guilds
    .findOne({
      id: guildId,
      admins: { $in: userId },
    })
    .catch(() => null)

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

  const guildModules = deleteKeyRecursively(
    dbGuild.modules ? (dbGuild.toObject().modules as GuildModulesWithData) : {},
    "_id",
  )

  for (const key of Object.keys(guildModules)) {
    guildModules[key as keyof GuildModules]!._data = {}
  }

  if (guildModules[ModuleId.Forms]) {
    const guildModule = guildModules[ModuleId.Forms]

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

  if (guildModules[ModuleId.Tickets]) {
    const guildModule = guildModules[ModuleId.Tickets]

    guildModule._data.message =
      apiChannels.find((c) => c.id === guildModule.channel) &&
      (await discordAPI.channels.getPins(guildModule.channel)).find(
        (pin) => pin.author.id === env.DISCORD_ID,
      )
  }

  if (guildModules[ModuleId.TwitchNotifications]) {
    const guildModule = guildModules[ModuleId.TwitchNotifications]

    guildModule._data.streamerNames = []

    for (const streamer of guildModule.streamers) {
      const user = await twitchClient.users.getUserById(streamer.id)
      if (user) (guildModule._data.streamerNames as string[]).push(user.name)
    }
  }

  const dashboardData: DashboardData = {
    _id: dbGuild._id.toString(),
    guild: {
      ...apiGuild,
      channels: apiChannels,
      admins: dbGuild.admins,
      commands: Object.fromEntries(dbGuild.commands ?? []),
      modules: guildModules,
    },
  }

  return dashboardData
})

export default async function Template({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const dashboardData = await getDashboardData()

  return (
    <ClientOnly>
      <DashboardProvider value={dashboardData}>{children}</DashboardProvider>
    </ClientOnly>
  )
}
