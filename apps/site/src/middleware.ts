import type { MiddlewareConfig } from "next/server"

export const config: MiddlewareConfig = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}

export { auth as middleware } from "~/auth"
