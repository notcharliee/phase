import { cookies, headers } from "next/headers"
import { Suspense } from "react"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { GuildSchema } from "@repo/schemas"

import { getInitials } from "@/lib/utils"
import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

import modules from "@/lib/modules"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)


const SelectGuild = async () => {
  await dbConnect()

  const user = {
    id: headers().get("x-user-id")!,
    token: headers().get("x-user-token")!,
  }

  const userREST = new REST({ authPrefix: "Bearer" }).setToken(user.token)
  const userAPI = new API(userREST)

  const guildDocuments = await GuildSchema.find({ admins: { $in: user.id } })
  const guildObjects = (await userAPI.users.getGuilds()).sort((a, b) => {
    const aIsInDocuments = guildDocuments.some(doc => doc.id == a.id)
    const bIsInDocuments = guildDocuments.some(doc => doc.id == b.id)
  
    if (aIsInDocuments && !bIsInDocuments) return -1
    else if (!aIsInDocuments && bIsInDocuments) return 1
    else return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })

  const selectedGuildDocument = guildDocuments.find(guild => guild.id == cookies().get("guild")?.value)
  const selectedGuildObject = guildObjects.find(guild => guild.id == selectedGuildDocument?.id)

  return (
    <Select defaultValue={selectedGuildObject?.id} value={selectedGuildObject?.id} onValueChange={setGuildCookie}>
      <SelectTrigger className="w-[180px] bg-popover">
        {selectedGuildObject ? (
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={selectedGuildObject.icon ? discordREST.cdn.icon(selectedGuildObject.id, selectedGuildObject.icon) : undefined} />
              <AvatarFallback className="text-xs">{getInitials(selectedGuildObject.name)}</AvatarFallback>
            </Avatar>
            <span>{selectedGuildObject.name}</span>
          </div>
        ) : "Select a server"}
      </SelectTrigger>
      <SelectContent>
        {guildObjects.map((guild, index) => (
          <SelectItem value={guild.id} key={index} disabled={!!(index >= guildDocuments.length)}>
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={guild.icon ? discordREST.cdn.icon(guild.id, guild.icon) : undefined} />
                <AvatarFallback className="text-xs">{getInitials(guild.name)}</AvatarFallback>
              </Avatar>
              <span>{guild.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


const setGuildCookie = async (guild: string) => {
  "use server"

  cookies().set("guild", guild)
}


export default () => (
  <Card className="w-full grow md:grow-0 md:overflow-auto relative">
    <CardHeader className="border-b border-border flex flex-row items-center justify-between gap-4 space-y-0 py-4 md:sticky md:top-0 md:bg-card">
      <CardTitle className="text-lg">Modules</CardTitle>
      <Suspense fallback={(
        <Select>
          <SelectTrigger className="w-[180px] bg-popover">
            Loading...
          </SelectTrigger>
        </Select>
      )}>
        <SelectGuild />
      </Suspense>
    </CardHeader>
    <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {modules.map((module, index) => (
        <Card key={index} className={"flex flex-col justify-between " + (!cookies().get("guild")?.value ? "pointer-events-none opacity-50" : "")}>
          <CardHeader>
            <CardTitle>{module.name}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant={"secondary"} className="w-full">Configure</Button>
          </CardFooter>
        </Card>
      ))}
    </CardContent>
  </Card>
)