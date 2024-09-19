import { Client } from "discord.js"

export type BotPrestart = (client: Client<false>) => void | Promise<void>
