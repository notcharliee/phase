import { type Metadata } from "next"
import { cookies, headers } from "next/headers"

import { GuildSchema } from "@repo/schemas"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import type { GuildChannelType, APIGuildChannel } from "discord-api-types/v10"

import { modulesConfig } from "@/config/modules"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import { Separator } from "@/components/ui/separator"
import { ModuleForm } from "./form"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export const moduleData = modulesConfig.find(
  (module) => module.name === "Audit Logs",
)!

export const metadata: Metadata = {
  title: moduleData.name,
  description: moduleData.description,
}

export default async () => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value!
  const userId = headers().get("x-user-id")!

  const guild = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  })
  if (!guild) return <h1>Access Denied</h1>

  const channels = (await discordAPI.guilds.getChannels(
    guildId,
  )) as APIGuildChannel<GuildChannelType>[]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{moduleData.name}</h3>
        <p className="text-muted-foreground text-sm">
          {moduleData.description}
        </p>
      </div>
      <Separator />
      <ModuleForm data={{ channels }} defaultValues={guild.modules.AuditLogs} />
    </div>
  )
}
