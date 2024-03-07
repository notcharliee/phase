import { type NextRequest, NextResponse } from "next/server"

export const challengeResponse = async (request: NextRequest) => {
  const json = (await request.json()) as object

  if ("challenge" in json && typeof json.challenge === "string") {
    return new Response(json.challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  } else {
    return NextResponse.json({ error: "Invalid challenge" }, { status: 400 })
  }
}
