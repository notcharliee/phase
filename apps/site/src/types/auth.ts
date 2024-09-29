import type { APIGuild, APIUser } from "discord-api-types/v10"
import type { Profile, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

interface SessionUser {
  id: string
  username: string
  globalName: string
  avatarUrl: string
}

interface SessionGuild extends Pick<APIGuild, "id"> {}

declare module "next-auth" {
  interface User {
    userId: string
    guildId?: string
  }

  interface Profile extends APIUser {}

  interface Session {
    user: SessionUser
    guild: SessionGuild
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    guildId?: string
  }
}

export type { Session, User, Profile, JWT }
