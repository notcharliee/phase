import { cookies, headers } from "next/headers"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  GET as getCommands,
  type GetBotCommandsResponse,
} from "@/app/api/bot/commands/route"

import { CommandForm } from "./form"

import { getGuilds } from "../../cache/guilds"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const Commands = async (props: { fallback?: boolean }) => {
  const fallback = Array.from({ length: 42 }, (_, index) => (
    <Card key={index} className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Loading...</CardTitle>
        <CardDescription>Loading...</CardDescription>
      </CardHeader>
      <CardContent>
        <CommandForm fallback />
      </CardContent>
    </Card>
  ))

  if (props.fallback) return fallback

  await dbConnect()

  const commands: GetBotCommandsResponse = await (await getCommands()).json().then(json => json)

  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!

  const guildId = cookies().get("guild")?.value!
  const cachedGuilds = await getGuilds(userId, userToken)
  const guild = cachedGuilds.database.find(guild => guild.id == guildId)

  if (!guild) return fallback

  const roles = await discordAPI.guilds.getRoles(guildId)
  
  return commands.map(command => (
    <Card key={command.name} className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{`/${command.name}`}</CardTitle>
        <CardDescription>{command.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CommandForm
          data={{
            command,
            roles,
          }}
          defaultValues={{
            role: guild.commands
              ? guild.commands[command.name]?.permissions ?? ""
              : "" 
          }}
        />
      </CardContent>
    </Card>
  ))
}
