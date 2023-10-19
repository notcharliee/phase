// next
import { NextResponse, NextRequest } from 'next/server'

// utils
import { API } from '@/utils/discord'

// packages
import { Routes, RESTGetAPICurrentUserGuildsResult } from 'discord-api-types/rest/v10'


export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {

    let discordApi = new API()

    let guilds = await discordApi.fetch<RESTGetAPICurrentUserGuildsResult>(`${Routes.userGuilds()}?with_counts=true`)

    let userCount = 0
    for (let guild of guilds) {
        userCount += guild.approximate_member_count || 0
    }

    return NextResponse.json({ userCount })

}