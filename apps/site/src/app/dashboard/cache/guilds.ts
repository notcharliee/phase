import { cache } from "react"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { GuildSchema } from "@repo/schemas"

import { dbConnect } from "@/lib/db"


const fn = async (userId: string, userToken: string) => {
  await dbConnect()

  const userREST = new REST({ authPrefix: "Bearer" }).setToken(userToken)
  const userAPI = new API(userREST)

  const discordGuilds = await userAPI.users.getGuilds({ with_counts: true })
  const databaseGuilds = await GuildSchema.find({ admins: userId })

  return {
    discord: discordGuilds,
    database: databaseGuilds,
  }
}


export const getGuilds = cache(fn)