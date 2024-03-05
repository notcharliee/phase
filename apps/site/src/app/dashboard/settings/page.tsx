import { cookies, headers } from "next/headers"

import { GuildSchema } from "@repo/schemas"

import {
  API,
  type APIGuildChannel,
  type GuildChannelType,
} from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { BotNicknameForm } from "./forms/bot-nickname"
import { DashboardAdminsForm } from "./forms/dashboard-admins"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { NewsChannelForm } from "./forms/news-channel"
import { SelectServerCombobox } from "../components/select/server"
import { Suspense } from "react"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export default async function SettingsPage() {
  await dbConnect()

  const guildId = cookies().get("guild")!.value
  const userId = headers().get("x-user-id")!

  const dbGuild = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  })

  if (!dbGuild) return <h1>Access Denied</h1>

  const discordGuild = await discordAPI.guilds.get(guildId)
  const discordChannels = (await discordAPI.guilds.getChannels(
    guildId,
  )) as APIGuildChannel<GuildChannelType>[]

  const userIsOwner = discordGuild.owner_id === userId

  const admins = await Promise.all(
    dbGuild.admins.map(async (admin) => {
      let user
  
      try {
        user = await discordAPI.users.get(admin)
      } catch (error) {
        console.error(error)
      }
  
      return {
        id: admin,
        name: user ? user.username : "Unknown User",
        avatar: user?.avatar
          ? discordREST.cdn.avatar(user.id, user.avatar, {
              size: 16,
            })
          : "/discord.png",
      }
    }),
  )

  

  const me = await discordAPI.guilds.getMember(guildId, env.DISCORD_ID)
  const nickname = me.nick ?? undefined

  const newsChannel =
    (dbGuild.news_channel as string | null | undefined) ?? undefined

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Change Server</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a server</DialogTitle>
              <DialogDescription>
                Please select a server to continue. You can change this at any
                time. If you don&rsquo;t see your server, make sure the bot is
                in it.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Suspense fallback={<SelectServerCombobox fallback />}>
                <SelectServerCombobox />
              </Suspense>
              <DialogClose className={buttonVariants()}>Close</DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden md:flex-row">
        <aside className="md:min-w-xs w-full md:h-[calc(100vh-4rem-1px-1.5rem-36px-1.5rem-2rem)] md:max-w-xs">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Dashboard Admins</CardTitle>
              <CardDescription>
                These are the users who have access to the dashboard and can
                manage the bot.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative w-full space-y-4">
              <DashboardAdminsForm
                userId={userId}
                userIsOwner={userIsOwner}
                defaultValues={{ admins }}
              />
            </CardContent>
          </Card>
        </aside>
        <div className="flex flex-col gap-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Bot Nickname</CardTitle>
              <CardDescription>
                Change the nickname of the bot in your server. This will not
                affect the bot&rsquo;s username. This is useful for servers with
                a lot of bots.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full pb-6">
              <BotNicknameForm defaultValues={{ nickname }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>News Channel</CardTitle>
              <CardDescription>
                Set a news channel for your server. This is how you can stay up
                to date about new commands, modules, possible outages, and more.
                Unlike the Phase discord server, you will not be pinged from
                this.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full pb-6">
              <NewsChannelForm
                discordChannels={discordChannels}
                defaultValues={{ channel: newsChannel }}
              />
            </CardContent>
          </Card>
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                All of these actions have permanent effects. Please be careful.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <div className="grid gap-3 sm:flex">
                <Button variant="destructive">Reset Bot</Button>
                <Button variant="destructive">Remove Bot</Button>
                <Button variant="destructive">Delete Data</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
