import { NextResponse } from "next/server"

export const challengeResponse = async (body: object) => {
  if ("challenge" in body && typeof body.challenge === "string") {
    return new Response(body.challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  } else {
    return NextResponse.json({ error: "Invalid challenge" }, { status: 400 })
  }
}
