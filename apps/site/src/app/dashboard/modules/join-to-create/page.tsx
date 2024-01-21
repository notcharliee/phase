import { type Metadata } from "next"
import { cookies, headers } from "next/headers"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import type {
  GuildChannelType,
  APIGuildChannel,
} from "discord-api-types/v10"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import { GuildSchema } from "@repo/schemas"

import { JoinToCreateForm } from "./form"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const metadata: Metadata = {
  title: "Join to Create - Phase Bot",
  description: "Dynamically creates a new, temporary voice channel and deletes it when all members leave.",
}


export default async () => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value!
  const userId = headers().get("x-user-id")!

  const guild = await GuildSchema.findOne({ id: guildId, admins: { $in: userId } })
  if (!guild) return <h1>Access Denied</h1>

  const channels = await discordAPI.guilds.getChannels(guildId) as APIGuildChannel<GuildChannelType>[]

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{metadata.title?.toString().replace(" - Phase Bot", "")}</h1>
        <p className="text-muted-foreground">{metadata.description}</p>
      </div>
      <JoinToCreateForm
        data={{ channels }}
        defaultValues={guild.modules.JoinToCreates}
      />
    </div>
  )
}
