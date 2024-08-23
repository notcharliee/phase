import { headers as getHeaders } from "next/headers"

export const getDashboardHeaders = () => {
  const headers = getHeaders()

  const guildId = headers.get("x-guild-id")
  const userId = headers.get("x-user-id")

  if (!guildId || !userId) {
    const missingHeaders = []
    if (!guildId) missingHeaders.push("x-guild-id")
    if (!userId) missingHeaders.push("x-user-id")
    throw new Error(
      `Missing required headers: '${missingHeaders.join("', '")}'`,
    )
  }

  return { guildId, userId }
}
