import { NextResponse, NextRequest } from 'next/server'

import { API } from '@discordjs/core/http-only'
import { REST } from '@discordjs/rest'


export const GET = async (request: NextRequest) => {

  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  const discordAPI = new API(discordREST)

  try {

    const authorizationURL = discordAPI.oauth2.generateAuthorizationURL({
      client_id: process.env.DISCORD_ID!,
      redirect_uri: process.env.BASE_URL + '/api/auth/callback',
      response_type: 'code',
      scope: 'identify guilds',
    })

    return NextResponse.redirect(authorizationURL)

  } catch (error) {

    console.log(error)

    return NextResponse.json(error, { status: 500 })
    
  }

}