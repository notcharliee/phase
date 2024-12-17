import { ApiClient } from "@twurple/api"
import { AppTokenAuthProvider } from "@twurple/auth"

import { env } from "~/lib/env"

export const twitchClient = new ApiClient({
  authProvider: new AppTokenAuthProvider(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET,
  ),
})
