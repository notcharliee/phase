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

const moduleData = modulesConfig.find((module) => module.name === "Tickets")!

export const metadata: Metadata = {
  title: moduleData.name,
  description: moduleData.description,
}

export default async function ModulePage() {
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

  const moduleConfig = guild.modules?.Tickets ?? {
    enabled: false,
    channel: "",
    tickets: [],
  }

  const pins =
    channels.find((c) => c.id === moduleConfig.channel) &&
    (await discordAPI.channels.getPins(moduleConfig.channel)).filter(
      (pin) => pin.author.id === env.DISCORD_ID,
    )

  const message = pins && pins[0]

  const data = { channels, message }
  const defaultValues = {
    ...moduleConfig,
    message: message?.embeds[0]?.description ?? "",
  }

  return <ModuleForm data={data} defaultValues={defaultValues} />
}
