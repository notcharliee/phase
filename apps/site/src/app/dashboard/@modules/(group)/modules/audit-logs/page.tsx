import { cookies, headers } from "next/headers"
import { Suspense } from "react"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import {
  APIGuildCategoryChannel,
  APITextChannel,
  ChannelType,
} from "discord-api-types/v10"

import { GuildSchema } from "@repo/schemas"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import { ModuleForm } from "./form"
import { default as LoadingState } from "./loading"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export default async () => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value!
  const userId = headers().get("x-user-id")!

  const guild = await GuildSchema.findOne({ id: guildId, admins: { $in: userId } })
  if (!guild) return

  const channels = await discordAPI.guilds.getChannels(guildId)

  const textChannels = (channels
    .filter(channel => channel.type == ChannelType.GuildText) as APITextChannel[])
    .sort((a, b) => a.position - b.position)

  const categoryChannels = (channels
    .filter(channel => channel.type == ChannelType.GuildCategory) as APIGuildCategoryChannel[])
    .sort((a, b) => a.position - b.position)

  const orderedChannels = new Map(categoryChannels.map(
    (category) => [
      category.id,
      textChannels.filter(
        (channel) => channel.parent_id! == category.id
      )
    ]
  ))

  return (
    <Suspense fallback={<LoadingState />}>
      <ModuleForm
        textChannels={textChannels}
        categoryChannels={categoryChannels}
        orderedChannels={orderedChannels}
        defaultValues={guild.modules.AuditLogs}
      />
    </Suspense>
  )
}