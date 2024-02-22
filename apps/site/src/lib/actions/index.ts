"use server"

import { cookies, headers } from "next/headers"

import { StatusCodes } from "http-status-codes"

import { GuildSchema, type GuildCommand } from "@repo/schemas"

import { dashboardNavConfig } from "@/config/nav/dashboard"
import { dbConnect } from "@/lib/db"
import { getUser } from "@/lib/auth"

import { updateModule } from "@/lib/actions/updateModule"
import { updateReactions } from "@/lib/actions/updateReactions"

export {
  updateModule,
  updateReactions,
}

export const updateCommand = async (command: string, data: GuildCommand) => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value
  const userId = headers().get("x-user-id")
  const userToken = headers().get("x-user-token")

  const commands = dashboardNavConfig.sidebarNav[1]!.items.map((item) =>
    item.title.replace("/", ""),
  )

  if (!guildId || !userId || !userToken || !commands.includes(command))
    throw StatusCodes.BAD_REQUEST

  const validUser = await getUser(userId, userToken)
  if (!validUser) throw StatusCodes.UNAUTHORIZED

  const guildSchema = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  })

  if (!guildSchema) throw StatusCodes.UNAUTHORIZED

  if (!guildSchema.commands) guildSchema.commands = {}
  if (data.permissions == " ") data.permissions = null

  guildSchema.commands[command] = data
  guildSchema.markModified("commands")

  try {
    await guildSchema.save()
    return StatusCodes.OK
  } catch (error) {
    console.log(error)
    throw StatusCodes.INTERNAL_SERVER_ERROR
  }
}

export const setGuildCookie = async (guild: string) => {
  "use server"

  if (guild === "") cookies().delete("guild")
  else cookies().set("guild", guild)
}
