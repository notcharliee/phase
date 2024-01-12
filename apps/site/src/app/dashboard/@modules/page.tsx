import { cookies, headers } from "next/headers"
import { Suspense } from "react"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { getInitials } from "@/lib/utils"
import { env } from "@/env"

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
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)


const SelectGuild = async () => {
  const guild = cookies().get("guild")?.value

  const userToken = headers().get("x-user-token")!
  const userREST = new REST({ authPrefix: "Bearer" }).setToken(userToken)
  const userAPI = new API(userREST)

  const userGuilds = (await userAPI.users.getGuilds())
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

  const guildObj = userGuilds.find(g => g.id == guild)

  return (
    <Select defaultValue={guild} value={guild} onValueChange={setGuildCookie}>
      <SelectTrigger className="w-[180px]">
        {guild && guildObj ? (
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={guildObj.icon ? discordREST.cdn.icon(guildObj.id, guildObj.icon) : undefined} />
              <AvatarFallback className="text-xs">{getInitials(guildObj.name)}</AvatarFallback>
            </Avatar>
            <span>{guildObj.name}</span>
          </div>
        ) : "Select a server"}
      </SelectTrigger>
      <SelectContent>
        {userGuilds.map(guild => (
          <SelectItem value={guild.id} key={guild.id}>
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
  <Card className="w-full grow md:grow-0">
    <CardHeader className="border-b border-border flex flex-row items-center justify-between gap-4 space-y-0 py-4">
      <CardTitle className="text-lg">Modules</CardTitle>
      <Suspense fallback={(
        <Select >
          <SelectTrigger className="w-[180px]">
            Loading...
          </SelectTrigger>
        </Select>
      )}>
        <SelectGuild />
      </Suspense>
    </CardHeader>
    <CardContent className="pt-6 flex flex-col">
      this is being worked on i promise
    </CardContent>
  </Card>
)