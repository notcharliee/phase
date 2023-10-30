import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'

import { API } from '@discordjs/core/http-only'
import { REST } from '@discordjs/rest'

import mongoose from 'mongoose'
import * as Schemas from 'utils/schemas'

import { randomUUID } from 'crypto'


export const GET = async (request: NextRequest) => {

  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  const discordAPI = new API(discordREST)

  const tokenExchangeCode = request.nextUrl.searchParams.get('code')

  if (!tokenExchangeCode) return NextResponse.json(
    {
      error: 'Bad Request',
      message: 'Provide a valid token exchange code.',
    }, { status: 400 },
  )

  try {

    const discordUserAccessToken = await discordAPI.oauth2.tokenExchange({
      client_id: process.env.DISCORD_ID!,
      client_secret: process.env.DISCORD_SECRET!,
      code: tokenExchangeCode,
      grant_type: 'authorization_code',
      redirect_uri: process.env.BASE_URL + '/api/auth/callback',
    })

    const discordUserREST = new REST({ authPrefix: 'Bearer' }).setToken(discordUserAccessToken.access_token)
    const discordUserAPI = new API(discordUserREST)

    const discordUserIdentity = await discordUserAPI.users.getCurrent()
    const discordUserGuilds = await discordUserAPI.users.getGuilds()

    const discordUserData = {
      identity: discordUserIdentity,
      guilds: discordUserGuilds,
      session: randomUUID(),
      token: discordUserAccessToken,
      timestamp: new Date().toISOString(),
    }

    cookies().set('authorised_user', discordUserData.session, {
      sameSite: true,
      secure: true,
    })

    await mongoose.connect(process.env.DATABASE_URI!)

    const authorisedUserSchema = await Schemas.AuthorisedUsers.findOne({ identity: { $elemMatch: { id: discordUserIdentity.id } } })

    if (authorisedUserSchema) {

      authorisedUserSchema.identity = discordUserData.identity
      authorisedUserSchema.guilds = discordUserData.guilds
      authorisedUserSchema.session = discordUserData.session
      authorisedUserSchema.token = discordUserData.token
      authorisedUserSchema.timestamp = discordUserData.timestamp

      await authorisedUserSchema.save()

    } else await new Schemas.AuthorisedUsers(discordUserData).save()

    return NextResponse.json(discordUserData)

  } catch (error) {

    console.log(error)

    return NextResponse.json(error, { status: 500 })
    
  } finally {

    await mongoose.connection.close()

  }

}