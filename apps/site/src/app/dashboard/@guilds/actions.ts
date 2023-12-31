"use server"

import { cookies } from "next/headers"

export const setGuild = async (guild: string) => {
  cookies().set("selected_guild", guild)
}
