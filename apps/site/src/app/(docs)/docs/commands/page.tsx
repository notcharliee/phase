import Image from 'next/image'

import { API } from '@discordjs/core/http-only'
import { REST } from '@discordjs/rest'


// Exporting page metadata

export const metadata = {
  title: 'Commands - Phase'
}


// Exporting page tsx

export default async () => {

  // const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  // const discordAPI = new API(discordREST)

  // const commandArray = await discordAPI.applicationCommands.getGlobalCommands(process.env.DISCORD_ID!)


  return (
    <div className='w-full max-w-[400px] bg-dark-700 p-4 rounded shadow border border-dark-600'>
      hello world
    </div>
  )

}