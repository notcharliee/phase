"use server"

import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import { kv } from "@vercel/kv"


export const deleteAccount = async () => {
  const sessionId = headers().get("x-user-session")
  const key = "auth:" + sessionId

  await kv.del(key)
  
  cookies().delete("session")

  redirect("/")
}