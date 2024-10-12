import { NextResponse } from "next/server"

import { auth } from "~/auth"

import type { MiddlewareConfig } from "next/server"

export const config: MiddlewareConfig = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}

export default auth((req) => {
  const pathname = req.nextUrl.pathname

  const guildId = pathname.startsWith("/dashboard/guilds/")
    ? pathname.split("/")[3]
    : undefined

  return NextResponse.next({
    headers: guildId ? { "x-guild-id": guildId } : undefined,
  })
})
