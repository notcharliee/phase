import { cache } from "react"

import { Guild, GuildSchema } from "@repo/schemas"
import { Document, Types } from "mongoose"

import { REST } from "@discordjs/rest"
import { API, RESTAPIPartialCurrentUserGuild } from "@discordjs/core/http-only"

import { dbConnect } from "@/lib/db"

type DiscordGuild = RESTAPIPartialCurrentUserGuild

type DatabaseGuild = Document<unknown, {}, Guild> &
  Guild & {
    _id: Types.ObjectId
  }

const fn = async (
  userId: string,
  userToken: string,
): Promise<{
  discord: DiscordGuild[]
  database: DatabaseGuild[]
}> => {
  try {
    await dbConnect()

    const userREST = new REST({ authPrefix: "Bearer" }).setToken(userToken)
    const userAPI = new API(userREST)

    const discordGuilds = await userAPI.users.getGuilds({ with_counts: true })
    const databaseGuilds = await GuildSchema.find({ admins: userId })

    return {
      discord: discordGuilds,
      database: databaseGuilds,
    }
  } catch (error) {
    console.error(error)

    return {
      discord: [],
      database: [],
    }
  }
}

export const getGuilds = cache(fn)
