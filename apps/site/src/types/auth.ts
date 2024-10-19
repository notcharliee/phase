import type { APIUser } from "@discordjs/core/http-only"
import type { Profile, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

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

export type { Session, User, Profile, JWT }
