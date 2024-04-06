import { createHmac, timingSafeEqual } from "crypto"

import { env } from "@/lib/env"

export const getHmacMessage = (headers: Headers, body: unknown): string => {
  return `${headers.get("twitch-eventsub-message-id")}${headers.get("twitch-eventsub-message-timestamp")}${JSON.stringify(body)}`
}

export const getHmac = (message: string): string => {
  return (
    "sha256=" +
    createHmac("sha256", env.TWITCH_CLIENT_SECRET).update(message).digest("hex")
  )
}

export const verifyHmac = (hmac: string, verifySignature: string): boolean => {
  return timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature))
}
