import { NextResponse } from "next/server"
import { env } from "@/lib/env"

export function GET() {
  return NextResponse.redirect(
    `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_ID}&response_type=code&scope=guilds%20identify%20bot%20applications.commands&redirect_uri=${env.NEXT_PUBLIC_BASE_URL}/api/login&permissions=486911216`,
  )
}
