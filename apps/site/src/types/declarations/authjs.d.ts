import type { APIUser } from "@discordjs/core/http-only"

import type {} from "next-auth"
import type {} from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    userId: string
  }

  interface Profile extends APIUser {}

  interface Session {
    user: {
      id: string
      username: string
      globalName: string
      avatarUrl: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
  }
}
