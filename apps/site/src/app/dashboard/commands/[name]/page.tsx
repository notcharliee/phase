import { cookies, headers } from "next/headers"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import axios from "axios"

import { GuildSchema } from "@repo/schemas"

import { Separator } from "@/components/ui/separator"
import { CommandForm } from "./form"

import type { Command } from "@/types/commands"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export default async ({ params }: { params: { name: string } }) => {
  await dbConnect()

  const commands = (await axios.get<Command[]>(env.NEXT_PUBLIC_BASE_URL + "/api/bot/commands")).data
  const command = commands.find(command => command.name == params.name.replaceAll("-", " "))

  const guildId = cookies().get("guild")?.value!
  const userId = headers().get("x-user-id")!

  const guild = await GuildSchema.findOne({ id: guildId, admins: { $in: userId } })
  if (!command || !guild) return <></>

  const roles = await discordAPI.guilds.getRoles(guildId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">/{command.name}</h3>
        <p className="text-sm text-muted-foreground">{command.description}</p>
      </div>
      <Separator />
      <CommandForm
        data={{
          command,
          roles,
        }}
        defaultValues={{
          role: guild.commands ? guild.commands[command.name]?.permissions ?? "" : "",
        }}
      />
    </div>
  )
}