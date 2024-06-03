import { NextResponse } from "next/server"

import { twitchClient } from "~/lib/twitch"

export const GET = async (
  _: unknown,
  { params }: { params: { username: string } },
) => {
  const username = params.username
  const user = await twitchClient.users.getUserByName(username)

  if (!user)
    return NextResponse.json("User not found.", {
      status: 404,
    })

  return NextResponse.json({
    id: user.id,
    type: user.type,
    name: user.name,
    displayName: user.displayName,
    description: user.description,
    profilePictureUrl: user.profilePictureUrl,
    offlinePlaceholderUrl: user.offlinePlaceholderUrl,
    broadcasterType: user.broadcasterType,
    creationDate: user.creationDate,
  })
}
