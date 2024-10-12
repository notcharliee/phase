"use server"

import { z } from "zod"

import { signIn } from "~/auth"

export async function signInWithDiscord() {
  await signIn("discord", { redirectTo: "/dashboard/guilds" })
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
