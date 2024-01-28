import { type Metadata } from "next"
import { cookies, headers } from "next/headers"

import { Suspense } from "react"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { GuildSchema } from "@repo/schemas"

import { Separator } from "@/components/ui/separator"
import { CommandForm } from "./form"

import {
  GET as getCommands,
  type GetBotCommandsResponse,
} from "@/app/api/bot/commands/route"

import { siteConfig } from "@/config/site"
import { dbConnect } from "@/lib/db"
import { absoluteURL } from "@/lib/utils"
import { env } from "@/lib/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const commandName = params.name

  return {
    title: `/${commandName}`,
    description: `Dashboard config for the /${commandName} command.`,
    openGraph: {
      title: `/${commandName}`,
      description: `Dashboard config for the /${params} command.`,
      type: "website",
      url: absoluteURL("/dashboard/commands/" + commandName),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `/${commandName}`,
      description: `Dashboard config for the /${commandName} command.`,
      images: [siteConfig.ogImage],
      creator: "@" + siteConfig.creator,
    },
  }
}


export default ({ params }: { params: { name: string } }) => (
  <Suspense fallback={<Form command={params.name} fallback />}>
    <Form command={params.name} />
  </Suspense>
)


const Form = async (props: { fallback?: boolean, command: string }) => {
  if (props.fallback) return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{`/${props.command.replaceAll("-", " ")}`}</h3>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
      <Separator />
      <CommandForm fallback />
    </div>
  )

  await dbConnect()

  const commands: GetBotCommandsResponse = await (await getCommands()).json().then(json => json)
  const command = commands.find(command => command.name == props.command.replaceAll("-", " "))

  const guildId = cookies().get("guild")?.value!
  const userId = headers().get("x-user-id")!

  const guild = await GuildSchema.findOne({ id: guildId, admins: { $in: userId } })
  if (!command || !guild) return <></>

  const roles = await discordAPI.guilds.getRoles(guildId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{`/${command.name.replaceAll("-", " ")}`}</h3>
        <p className="text-sm text-muted-foreground">{command.description}</p>
      </div>
      <Separator />
      <CommandForm
        data={{ command, roles }}
        defaultValues={{ role: guild.commands ? guild.commands[command.name]?.permissions ?? "" : "" }}
      />
    </div>
  )
}
