import { type Metadata } from "next"
import { cookies, headers } from "next/headers"

import { GuildSchema } from "@repo/schemas"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import type { GuildChannelType, APIGuildChannel } from "discord-api-types/v10"

import { modulesConfig } from "@/config/modules"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import { ModuleForm } from "./form"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

const moduleData = modulesConfig.find((module) => module.name === "Audit Logs")!

export const metadata: Metadata = {
  title: moduleData.name,
  description: moduleData.description,
}

export default async function ModulePage() {
  await dbConnect()

  const guildId = cookies().get("guild")!.value
  const userId = headers().get("x-user-id")!

  const guild = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  })
  if (!guild) return <h1>Access Denied</h1>

  const channels = (await discordAPI.guilds.getChannels(
    guildId,
  )) as APIGuildChannel<GuildChannelType>[]

  const moduleConfig = guild.modules?.AuditLogs ?? {
    enabled: false,
    channels: {
      server: null,
      members: null,
      messages: null,
      punishments: null,
      voice: null,
      invites: null,
    },
  }

  return <ModuleForm data={{ channels }} defaultValues={moduleConfig} />
}
