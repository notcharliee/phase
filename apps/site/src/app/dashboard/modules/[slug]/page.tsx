import { API, type APIMessage } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { type GuildModules } from "@repo/schemas"

import { modulesConfig } from "@/config/modules"

import { env } from "@/lib/env"

import { getAuthCredentials, getUser } from "../../_cache/user"
import { DashboardHeader } from "../../components/header"
import * as moduleForms from "./_forms"
import { getTwitchUserById } from "./actions"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const moduleData = modulesConfig.find(
    (module) => module.path === "/" + params.slug,
  )!

  return {
    title: moduleData.name,
    description: moduleData.description,
  }
}

export default async function ModulePage({
  params,
}: {
  params: { slug: string }
}) {
  const userAndGuildData = await getUser(...getAuthCredentials())

  const moduleConfig = modulesConfig.find(
    (module) => module.path === "/" + params.slug,
  )

  if (!moduleConfig) return <h1>Module not found</h1>

  const moduleKey = moduleConfig.name
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replaceAll(" ", "") as keyof typeof moduleForms

  const defaultValues =
    userAndGuildData.guild.modules?.[moduleKey] &&
    (await modifyDefaultValues(
      moduleKey,
      userAndGuildData.guild.modules[moduleKey]!,
    ))

  const data = await modifyData(moduleKey, defaultValues, {
    ...userAndGuildData,
  })

  const ModuleForm = moduleForms[moduleKey]

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-8">
      <DashboardHeader
        name={userAndGuildData.user.global_name}
        avatar={userAndGuildData.user.avatar_url}
        title={moduleConfig.name}
      />
      <ModuleForm
        data={data}
        // making typescript happy (this is a hack and it's not the best solution)
        defaultValues={
          defaultValues as UnionToIntersection<typeof defaultValues>
        }
      />
    </div>
  )
}

const modifyData = async <T extends keyof GuildModules>(
  moduleKey: T,
  defaultValues: GuildModules[T] | undefined,
  unknownData: Awaited<ReturnType<typeof getUser>>,
) => {
  let message: APIMessage | undefined
  let messages: APIMessage[] | undefined

  if (moduleKey === "Tickets" && defaultValues) {
    const moduleData = defaultValues as GuildModules["Tickets"]

    const pins =
      unknownData.guild.channels.find((c) => c.id === moduleData.channel) &&
      (await discordAPI.channels.getPins(moduleData.channel)).filter(
        (pin) => pin.author.id === env.DISCORD_ID,
      )

    message = pins?.[0]
  } else if (moduleKey === "Forms" && defaultValues) {
    const moduleData = defaultValues as GuildModules["Forms"]

    messages = (
      await Promise.all(
        moduleData.forms.map(async (form) => {
          if (
            unknownData.guild.channels.find(
              (channel) => channel.id === form.channel,
            )
          ) {
            const pins = (
              await discordAPI.channels.getPins(form.channel)
            ).filter((pin) => pin.author.id === env.DISCORD_ID)

            return pins[0]
          }
        }),
      )
    ).filter(Boolean) as APIMessage[]
  }

  return {
    ...unknownData,
    message,
    messages,
  }
}

const modifyDefaultValues = async <T extends keyof GuildModules>(
  moduleKey: T,
  unknownValues: GuildModules[T],
) => {
  if (moduleKey === "TwitchNotifications") {
    const moduleData = unknownValues as GuildModules["TwitchNotifications"]

    for (const streamer of moduleData.streamers) {
      const user = await getTwitchUserById(streamer.id)
      if (user) streamer.id = user.name
    }

    return moduleData
  }

  return unknownValues
}
