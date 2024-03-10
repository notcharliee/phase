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

import ms from "ms"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

const moduleData = modulesConfig.find(
  (module) => module.name === "Auto Messages",
)!

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

  const roles = await discordAPI.guilds.getRoles(guildId)

  const moduleConfig = guild.modules?.AutoMessages
    ? {
        enabled: guild.modules.AutoMessages.enabled,
        messages: guild.modules.AutoMessages.messages.map((message) => ({
          ...message,
          interval: ms(message.interval, { long: true }),
          startAt: new Date(Date.now() + message.interval),
        })),
      }
    : {
        enabled: false,
        messages: [],
      }

  const data = { channels, roles }

  return <ModuleForm data={data} defaultValues={moduleConfig} />
}
