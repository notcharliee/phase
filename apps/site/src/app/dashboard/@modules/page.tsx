import { cookies, headers } from "next/headers"
import { Suspense } from "react"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { getInitials } from "@/lib/utils"
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
  const guild = cookies().get("guild")?.value

  const userToken = headers().get("x-user-token")!
  const userREST = new REST({ authPrefix: "Bearer" }).setToken(userToken)
  const userAPI = new API(userREST)

  const userGuilds = (await userAPI.users.getGuilds())
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

  const guildObj = userGuilds.find(g => g.id == guild)

  return (
    <Select defaultValue={guild} value={guild} onValueChange={setGuildCookie}>
      <SelectTrigger className="w-[180px] bg-popover">
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
        <Card key={index} className="flex flex-col justify-between">
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