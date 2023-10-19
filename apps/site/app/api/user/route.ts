import { NextResponse, NextRequest } from 'next/server'

import * as db from '@/utils/database'
import { API } from '@/utils/discord'

import { Routes, RESTPostOAuth2RefreshTokenResult, RESTGetAPICurrentUserResult, RESTGetAPICurrentUserGuildsResult } from 'discord-api-types/rest/v10'


export async function GET(request: NextRequest) {

    let url = new URL(request.url)

    let client_id: string = process.env.clientID!
    let client_secret: string = process.env.clientSecret!
    let code = url.searchParams.get('code')

    if(!code) {
        return NextResponse.json({ err: 'Error! Please supply a code to use this endpoint.' }, { status: 401 })
    }

    let discordApi = new API()

    let schema = await db.logins.findOne({ refresh_token: code })

    try {

        let token = await discordApi.fetch<RESTPostOAuth2RefreshTokenResult, URLSearchParams>(Routes.oauth2TokenExchange(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id,
                client_secret,
                grant_type: 'refresh_token',
                refresh_token: code,
            })
        })
        
        let { access_token, refresh_token, token_type } = token
        
        let guilds = await discordApi.fetch<RESTGetAPICurrentUserGuildsResult>(`${Routes.userGuilds()}?with_counts=true`, {
            method: 'GET',
            headers: { 'Authorization': `${token_type} ${access_token}` }
        })

        let user = await discordApi.fetch<RESTGetAPICurrentUserResult>(Routes.user('@me'), {
            method: 'GET',
            headers: { 'Authorization': `${token_type} ${access_token}` }
        })
        
        if(schema) {
            schema.refresh_token = refresh_token
            schema.save()
        } else {
            return NextResponse.json({ err: 'Internal Server Error' }, { status: 500 })
        }
    
        return NextResponse.json({ user, guilds })

    } catch(err) {
        if(schema) return NextResponse.json({ user: schema.user, guilds: schema.guilds })
        else return NextResponse.json({ err: err }, { status: 500 })
    }

}