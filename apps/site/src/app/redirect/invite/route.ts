import { NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-static"

export function GET() {
  return NextResponse.redirect(
    `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_ID}&response_type=code&scope=guilds%20identify%20bot%20applications.commands&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/api/login&permissions=486911216`,
  )
}
