import { WebhookClient } from "discord.js"

import { env } from "~/lib/env"

export const alertWebhook = new WebhookClient({
  url: env.WEBHOOK_ALERT,
})
