import { cliSpinner } from "~/utils/cli-spinner"

import type { Client } from "discord.js"

/**
 * 
 * Loads commands and events.
 * 
 * @param client Your discord.js client instance.
 * @returns Logged in client instance.
 */
export const startBot = async (client: Client) => {
  try {
    const token = process.env.BOT_TOKEN
    if (!token) throw new Error("Missing 'BOT_TOKEN' environment variable.")

    const login = client.login(token)

    await cliSpinner(
      login,
      "Connecting to Discord...",
      "Connected successfully."
    )
  } catch (error) {
    throw error
  }

  return client as Client<true>
}
