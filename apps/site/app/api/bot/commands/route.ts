import { NextResponse, NextRequest } from 'next/server'

import { API } from '@discordjs/core/http-only'
import { REST } from '@discordjs/rest'


export const GET = async (request: NextRequest) => {

  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  const discordAPI = new API(discordREST)

  const commandArray = await discordAPI.applicationCommands.getGlobalCommands(process.env.DISCORD_ID!)

  return NextResponse.json(commandArray)

}