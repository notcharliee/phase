"use server"

import { cookies } from "next/headers"

import { OtpSchema } from "@repo/schemas"
import { kv } from "@vercel/kv"
import { compare } from "bcryptjs"
import ms from "ms"
import { v4 as randomUUID } from "uuid"

import { dbConnect } from "@/lib/db"

import type { User } from "@/types/auth"

/**
 * Validates the OTP
 * @param otp The OTP to validate
 * @returns Whether the OTP is valid
 */
export const validateOTP = async (
  userId: string,
  guildId: string,
  otp: string,
): Promise<boolean> => {
  await dbConnect()

  const otpDoc = await OtpSchema.findOne({
    userId,
    guildId,
  }).setOptions({
    sanitizeFilter: true,
  })

  if (!otpDoc) return false

  const isValidOtp = await compare(otp, otpDoc.otp)

  if (!isValidOtp) return false

  await otpDoc.deleteOne()

  const uuid = randomUUID()

  const user: User = {
    user_id: otpDoc.userId,
    guild_id: otpDoc.guildId,
    expires: Date.now() + ms("1d"),
  }

  // Set the session cookie
  cookies().set("session", uuid, {
    expires: new Date(user.expires),
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  })

  // Set the session in the KV store
  await kv.set(`session:${uuid}`, user, {
    px: ms("1d"),
  })

  return true
}
