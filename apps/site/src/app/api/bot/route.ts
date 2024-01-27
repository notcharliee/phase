import { NextResponse } from "next/server"
import { AppConfigDynamic } from "next/dist/build/utils"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { env } from "@/lib/env"
import type { ExtractAPIType } from "@/types/api"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const dynamic: AppConfigDynamic = "force-dynamic"


export const GET = async () => {
  const bot = await discordAPI.oauth2.getCurrentBotApplicationInformation()

  const response = {
    id: bot.id,
    name: bot.name,
    description: bot.description,
    icon: bot.icon ? discordREST.cdn.appIcon(bot.id, bot.icon) : null,
    owner: bot.owner ?? null,
    guild_count: bot.approximate_guild_count ?? null,
  }

  return NextResponse.json(response)
}


export type GetBotResponse = ExtractAPIType<typeof GET>
