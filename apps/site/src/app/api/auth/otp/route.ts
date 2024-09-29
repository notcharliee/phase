import { createHmac } from "node:crypto"

import { NextResponse } from "next/server"

import { connectDB } from "~/lib/db"
import { env } from "~/lib/env"

import type { NextRequest } from "next/server"

export type OTPResponse =
  | {
      success: true
      data: {
        userId: string
        guildId: string
      }
    }
  | {
      success: false
      message: string
    }

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const code = searchParams.get("code")

  if (!code || !/^[a-zA-Z0-9]{6}$/.test(code)) {
    return NextResponse.json<OTPResponse>(
      {
        success: false,
        message: "Invalid code provided",
      },
      { status: 400 },
    )
  }

  const signedCode = createHmac("sha256", env.AUTH_OTP_SECRET)
    .update(code)
    .digest("hex")

  const db = await connectDB()

  const optDoc = await db.otps.findOneAndDelete({ otp: signedCode })

  if (!optDoc) {
    return NextResponse.json<OTPResponse>(
      {
        success: false,
        message: "Invalid or expired code provided",
      },
      { status: 400 },
    )
  }

  return NextResponse.json<OTPResponse>(
    {
      success: true,
      data: {
        userId: optDoc.userId,
        guildId: optDoc.guildId,
      },
    },
    { status: 200 },
  )
}
