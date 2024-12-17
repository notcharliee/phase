"use server"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { connectDB } from "~/lib/db"
import { env } from "~/lib/env"

export interface Guild {
  id: string
  name: string
  icon_url: string | null
  member_count: number
  presence_count: number
}

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export const getGuilds = async (userId: string) => {
  const db = await connectDB()
  const dbGuilds = await db.guilds.find({ admins: { $in: userId } })

  const guilds: Guild[] = []

  for (const dbGuild of dbGuilds) {
    const guildId = dbGuild.id as string

    const guild = await discordAPI.guilds
      .get(guildId, { with_counts: true })
      .catch(() => null)

    if (guild) {
      const iconURL = guild.icon
        ? discordREST.cdn.icon(guild.id, guild.icon)
        : null

      guilds.push({
        id: guild.id,
        name: guild.name,
        icon_url: iconURL,
        member_count: guild.approximate_member_count ?? 0,
        presence_count: guild.approximate_presence_count ?? 0,
      })
    }
  }

  return guilds
}
