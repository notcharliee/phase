"use server"

import { NextRequest } from "next/server"

import { ApiClient } from "@twurple/api"
import { AppTokenAuthProvider } from "@twurple/auth"

import { POST as postTwitchApiRoute } from "@/app/api/twitch/route"

import { env } from "@/lib/env"
import { absoluteURL } from "@/lib/utils"

export const getTwitchUserByName = async (username: string) => {
  const authProvider = new AppTokenAuthProvider(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET,
  )

  const twitchClient = new ApiClient({
    authProvider,
  })

  try {
    const user = await twitchClient.users.getUserByName(username)

    const result = user
      ? {
          id: user.id,
          name: user.name,
          displayName: user.displayName,
        }
      : undefined

    return result
  } catch (error) {
    return undefined
  }
}

export const getTwitchUserById = async (id: string) => {
  const authProvider = new AppTokenAuthProvider(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET,
  )

  const twitchClient = new ApiClient({
    authProvider,
  })

  try {
    const user = await twitchClient.users.getUserById(id)

    const result = user
      ? {
          id: user.id,
          name: user.name,
          displayName: user.displayName,
        }
      : undefined

    return result
  } catch (error) {
    return undefined
  }
}

export const addChannelSubscription = async (channelId: string) => {
  const request = new NextRequest(absoluteURL("/api/twitch"), {
    body: JSON.stringify({ channelId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.TWITCH_CLIENT_SECRET}`,
    },
    method: "POST",
  })

  const response = await postTwitchApiRoute(request)

  return response.status
}
