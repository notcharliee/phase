import { type Metadata } from "next"
import { cookies, headers } from "next/headers"
import Link from "next/link"

import { GuildSchema } from "@repo/schemas"

import { REST } from "@discordjs/rest"
import { API, GuildFeature } from "@discordjs/core/http-only"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { ModuleForm } from "./form"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const metadata: Metadata = {
  title: "Auto Roles - Phase Bot",
  description: "Automatically assigns roles to new members of your server as soon as they join.",
}


export default async () => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value!
  const userId = headers().get("x-user-id")!

  const guild = await GuildSchema.findOne({ id: guildId, admins: { $in: userId } })
  if (!guild) return <h1>Access Denied</h1>

  const alertIsNecessary = !!((await discordAPI.guilds.get(guildId)!).features.includes(GuildFeature.MemberVerificationGateEnabled))

  const roles = await discordAPI.guilds.getRoles(guildId)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{metadata.title?.toString().replace(" - Phase Bot", "")}</h1>
        <p className="text-muted-foreground">{metadata.description}</p>
      </div>
      <ModuleForm
        data={{ roles }}
        defaultValues={guild.modules.AutoRoles}
      />
      {alertIsNecessary && (
        <Alert className="max-w-[500px] animate-in fade-in-0 duration-700 slide-in-from-bottom-7">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Because <Link href="https://support.discord.com/hc/en-us/articles/1500000466882-Rules-Screening-FAQ">Rules Screening</Link> is enabled in this server, roles will only be applied once the user has agreed to your server's rules.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
