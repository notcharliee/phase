import { NextResponse } from "next/server"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"

import { env } from "~/lib/env"

import type { OTPResponse } from "~/app/api/auth/otp/route"
import type { JWT, Profile, Session } from "~/types/auth"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_COOKIE_SECRET,
  cookies: {
    sessionToken: {
      options: {
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    DiscordProvider({
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
      clientId: env.DISCORD_ID,
      clientSecret: env.DISCORD_SECRET,
      profile(profile: Profile) {
        return { userId: profile.id! }
      },
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: { code: {} },
      async authorize({ code }, request) {
        const url = new URL(`/api/auth/otp?code=${String(code)}`, request.url)

        const response = await fetch(url.toString(), { method: "POST" })
        const json = (await response.json()) as OTPResponse

        if (!json.success) {
          throw new Error(json.message)
        }

        return json.data
      },
    }),
  ],
  callbacks: {
    async jwt({ user, account, token, trigger }) {
      if (trigger === "signIn" && user?.userId) {
        token.userId = user.userId

        if (account?.access_token) {
          void discordAPI.oauth2.revokeToken(
            env.DISCORD_ID,
            env.DISCORD_SECRET,
            {
              token: account.access_token,
              token_type_hint: "access_token",
            },
          )
        }
      }

      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const userId = token.userId

      if (!userId) {
        console.error("[Session] Missing user ID in JWT")
        return session
      }

      try {
        const discordUser = await discordAPI.users.get(userId)

        session.user = {
          id: discordUser.id,
          username: discordUser.username,
          globalName: discordUser.global_name ?? discordUser.username,
          avatarUrl: discordUser.avatar
            ? discordREST.cdn.avatar(discordUser.id, discordUser.avatar)
            : discordREST.cdn.defaultAvatar(
                discordUser.discriminator === "0"
                  ? Number(BigInt(userId) >> 22n) % 6
                  : Number(discordUser.discriminator) % 5,
              ),
        }
      } catch (error) {
        console.error("[Session] Failed to fetch user data:")
        console.error(error)
        return session
      }

      return session
    },
    authorized({ request, auth }) {
      const { method, nextUrl } = request
      const { pathname } = nextUrl

      if (!auth?.user) {
        if (pathname === "/auth/signin") {
          return NextResponse.next()
        }

        return method === "GET"
          ? NextResponse.redirect(new URL("/auth/signin", request.url))
          : NextResponse.json("Missing user credentials", { status: 401 })
      }

      return true
    },
  },
})
