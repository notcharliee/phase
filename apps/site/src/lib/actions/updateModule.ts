"use server"

import { cookies, headers } from "next/headers"

import { StatusCodes } from "http-status-codes"

import { GuildSchema, type GuildModules, type GuildModule } from "@repo/schemas"

import { dbConnect } from "@/lib/db"
import { getUser } from "@/lib/auth"

/**
 * @param moduleName The name of the module.
 * @param moduleData The data to update.
 * @returns The updated module data.
 * 
 * @throws 400 - If headers or cookies are missing.
 * @throws 401 - If unauthorized.
 */
export const updateModule = async <TName extends keyof GuildModules>(
  moduleName: TName,
  moduleData: Partial<GuildModule<TName>>,
) => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value
  const userId = headers().get("x-user-id")
  const userToken = headers().get("x-user-token")

  if (!guildId || !userId || !userToken) throw StatusCodes.BAD_REQUEST

  const validUser = await getUser(userId, userToken)
  if (!validUser) throw StatusCodes.UNAUTHORIZED

  const guildSchema = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  })
  
  if (!guildSchema) throw StatusCodes.UNAUTHORIZED

  const module: GuildModule<TName> = guildSchema.modules[moduleName]
  const moduleDataKeys = Object.keys(moduleData) as (keyof typeof module)[]

  for (const key of moduleDataKeys) {
    module[key] = (moduleData as GuildModule<TName>)[key]
  }

  guildSchema.markModified("modules")

  try {
    await guildSchema.save()
    return module
  } catch (error) {
    throw error
  }
}
