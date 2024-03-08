import { type Metadata } from "next"
import { cookies, headers } from "next/headers"

import { GuildSchema } from "@repo/schemas"

import { modulesConfig } from "@/config/modules"

import { dbConnect } from "@/lib/db"

import { ModuleForm } from "./form"

import ms from "ms"

const moduleData = modulesConfig.find(
  (module) => module.name === "Bump Reminders",
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

  const moduleConfig = guild.modules?.BumpReminders ? {
    ...guild.modules.BumpReminders,
    time: ms(guild.modules.BumpReminders.time, { long: true }),
  } : {
    enabled: false,
    time: "",
    initialMessage: "",
    reminderMessage: "",
  }

  return <ModuleForm defaultValues={moduleConfig} />
}
