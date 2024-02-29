import { type Metadata } from "next"
import { cookies, headers } from "next/headers"

import { GuildSchema } from "@repo/schemas"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import type {
  GuildChannelType,
  APIGuildChannel,
  APIMessage,
} from "discord-api-types/v10"

import { modulesConfig } from "@/config/modules"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import { ModuleForm } from "./form"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

const moduleData = modulesConfig.find((module) => module.name === "Forms")!

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

  const moduleConfig = guild.modules?.Forms
    ? {
        ...guild.modules.Forms,
        forms: guild.modules?.Forms.forms.map((form) => ({
          ...form,
          questions: form.questions.map((question) => ({ question })),
        })),
      }
    : {
        enabled: false,
        channel: "",
        forms: [],
      }

  const messages = (
    await Promise.all(
      moduleConfig.forms.map(async (form) => {
        if (channels.find((channel) => channel.id === form.channel)) {
          const pins = (await discordAPI.channels.getPins(form.channel)).filter(
            (pin) => pin.author.id === env.DISCORD_ID,
          )

          return pins[0]
        }
      }),
    )
  ).filter(Boolean) as APIMessage[]

  const data = { channels, messages }

  return <ModuleForm data={data} defaultValues={moduleConfig} />
}
