import { cookies, headers } from "next/headers"
import React, { Suspense } from "react"
import Link from "next/link"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { GuildSchema } from "@repo/schemas"

import { getInitials } from "@/lib/utils"
import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import { PlusCircledIcon } from "@radix-ui/react-icons"

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
  SelectSeparator,
} from "@/components/ui/select"


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
          <div className="flex items-center gap-2 line-clamp-1">
            <Avatar className="w-5 h-5">
              <AvatarImage src={selectedGuildObject.icon ? discordREST.cdn.icon(selectedGuildObject.id, selectedGuildObject.icon) : undefined} />
              <AvatarFallback className="text-xs">{getInitials(selectedGuildObject.name)}</AvatarFallback>
            </Avatar>
            <span>{selectedGuildObject.name}</span>
          </div>
        ) : "Select a server"}
      </SelectTrigger>
      <SelectContent>
        <Link href={"/redirect/invite"} className="select-none text-sm py-1.5 px-2 flex items-center hover:underline">
          <PlusCircledIcon className="mr-2 w-4 h-4" /> Add a server
        </Link>
        <SelectSeparator />
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


export default ({ children }: { children: React.ReactNode }) => (
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
    {children}
  </Card>
)