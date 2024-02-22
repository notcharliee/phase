import { type Metadata } from "next"
import { cookies, headers } from "next/headers"

import { GuildSchema } from "@repo/schemas"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { modulesConfig } from "@/config/modules"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import { ModuleHeading } from "@/app/dashboard/components/module-heading"
import { ModuleForm } from "./form"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

const moduleData = modulesConfig.find((module) => module.name === "Auto Roles")!

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

  const roles = await discordAPI.guilds.getRoles(guildId)

  return (
    <ModuleHeading>
      <ModuleForm
        data={{ roles }}
        defaultValues={{
          ...guild.modules.AutoRoles,
          roles: guild.modules.AutoRoles.roles.map((role) => ({ role })),
        }}
      />
    </ModuleHeading>
  )
}
