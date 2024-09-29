"use server"

import { z } from "zod"

import { connectDB } from "~/lib/db"

import { auth, signIn, updateSession } from "~/auth"

export async function signInWithDiscord() {
  await signIn("discord", { redirectTo: "/auth/guilds" })
}

export async function signInWithOTP(unsafeData: string) {
  const dataParseResult = z
    .string()
    .regex(/^[a-zA-Z0-9]{6}$/)
    .safeParse(unsafeData)

  if (dataParseResult.success) {
    await signIn("otp", { code: dataParseResult.data })
  } else {
    throw new Error("Invalid data")
  }
}

export async function selectGuild(unsafeData: string) {
  const dataParseResult = z.string().min(17).max(19).safeParse(unsafeData)

  if (dataParseResult.success) {
    const guildId = dataParseResult.data
    const userId = (await auth())!.user.id

    try {
      const db = await connectDB()
      const dbGuilds = await db.guilds.find({ admins: { $in: userId } })
      const dbGuildIds = dbGuilds.map((guild) => guild.id as string)

      if (!dbGuildIds.includes(guildId)) {
        throw new Error("Guild not found")
      }

      await updateSession({ guild: { id: guildId } })
    } catch {
      throw new Error("Failed to update session guild ID")
    }
  } else {
    throw new Error("Invalid data")
  }
}
