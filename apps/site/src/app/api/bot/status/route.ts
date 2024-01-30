import { NextResponse } from "next/server"
import { AppConfigDynamic } from "next/dist/build/utils"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { env } from "@/lib/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const dynamic: AppConfigDynamic = "force-dynamic"


export const GET = async () => {
  const statusChannel = await discordAPI.channels.get("1201548460290224178")

  const status = statusChannel.name?.startsWith("🟢")
    ? "OK"
    : statusChannel.name?.startsWith("🟠")
      ? "ISSUES"
      : statusChannel.name?.startsWith("🔴")
        ? "DOWN"
        : "UNKNOWN"

  return NextResponse.json(status)
}


export type GetBotStatusResponse = "OK" | "ISSUES" | "DOWN" | "UNKNOWN"
