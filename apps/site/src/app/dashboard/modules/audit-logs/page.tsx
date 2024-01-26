import { type Metadata } from "next"
import { cookies, headers } from "next/headers"

import { GuildSchema } from "@repo/schemas"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import type {
  GuildChannelType,
  APIGuildChannel,
} from "discord-api-types/v10"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import { Separator } from "@/components/ui/separator"

import { ModuleForm } from "./form"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const metadata: Metadata = {
  title: "Audit Logs - Phase Bot",
  description: "Provides a detailed log of all server activities and events to the channel of your choice.",
}


export default async () => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value!
  const userId = headers().get("x-user-id")!

  const guild = await GuildSchema.findOne({ id: guildId, admins: { $in: userId } })
  if (!guild) return <h1>Access Denied</h1>

  const channels = await discordAPI.guilds.getChannels(guildId) as APIGuildChannel<GuildChannelType>[]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{metadata.title?.toString().replace(" - Phase Bot", "")}</h3>
        <p className="text-sm text-muted-foreground">{metadata.description}</p>
      </div>
      <Separator />
      <ModuleForm
        data={{ channels }}
        defaultValues={guild.modules.AuditLogs}
      />
    </div>
  )
}
