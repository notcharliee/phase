import Image from "next/image"
import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { env } from '@/env'

// Exporting page metadata

export const metadata = {
  title: "Modules - Phase",
}

// Exporting page tsx

export default async () => {
  // const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  // const discordAPI = new API(discordREST)

  // const commandArray = await discordAPI.applicationCommands.getGlobalCommands(env.DISCORD_ID)

  return (
    <div className="w-full max-w-[400px] rounded border border-dark-600 bg-dark-700 p-4 shadow">
      hello world
    </div>
  )
}
