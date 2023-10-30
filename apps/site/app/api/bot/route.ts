import { NextResponse, NextRequest } from 'next/server'

import { API } from '@discordjs/core/http-only'
import { REST } from '@discordjs/rest'


export const GET = async (request: NextRequest) => {

  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  const discordAPI = new API(discordREST)

  try {

    const botApplicationInfo = await discordAPI.oauth2.getCurrentBotApplicationInformation()

    const botStats = {
      id: botApplicationInfo.id,
      name: botApplicationInfo.name,
      icon: botApplicationInfo.icon ? discordREST.cdn.appIcon(botApplicationInfo.id, botApplicationInfo.icon, { size: 512 }) : null,
      description: botApplicationInfo.description,
      terms_of_service_url: botApplicationInfo.terms_of_service_url ?? null,
      privacy_policy_url: botApplicationInfo.privacy_policy_url ?? null,
      bot_public: botApplicationInfo.bot_public,
      approximate_guild_count: botApplicationInfo.approximate_guild_count,
    }

    return NextResponse.json(botStats)

  } catch (error) {

    console.log(error)

    return NextResponse.json(error, { status: 500 })
    
  }

}