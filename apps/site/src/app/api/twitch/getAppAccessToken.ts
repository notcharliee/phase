import { AppTokenAuthProvider } from "@twurple/auth"

import { env } from "@/lib/env"

export const getAppAccessToken = async () => {
  const authProvider = new AppTokenAuthProvider(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET,
  )

  return (await authProvider.getAppAccessToken()).accessToken
}
