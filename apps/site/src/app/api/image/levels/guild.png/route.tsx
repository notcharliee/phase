import { Font } from "next/dist/compiled/@vercel/og/satori"
import { NextRequest, NextResponse } from "next/server"
import { ImageResponse } from "next/og"
import { env } from "@/env"
import { z } from "zod"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const rankStart = parseInt(request.nextUrl.searchParams.get("rankStart") || "1", 10)
  const rankEnd = parseInt(request.nextUrl.searchParams.get("rankEnd") || "1", 10)
  const guildId = request.nextUrl.searchParams.get("guild")

  const primaryColour = request.nextUrl.searchParams.get("primaryColour") ?? "f8f8f8"
  const secondaryColour = request.nextUrl.searchParams.get("secondaryColour") ?? "c0c0c0"

  const backgroundColour = request.nextUrl.searchParams.get("backgroundColour") ?? "080808"
  const backgroundImage = request.nextUrl.searchParams.get("backgroundImage") ?? undefined
  const background = backgroundImage ? `url(${backgroundImage})` : "#"+backgroundColour

  try {
    const dataResponse = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/levels/guild?guild=${guildId}&rankStart=${rankStart}&rankEnd=${rankEnd}&t=${Date.now()}`)
    const dataResponseJSON = await dataResponse.json() as unknown
  
    const dataSchema = z.array(
      z.object({
        id: z.string(),
        username: z.string(),
        global_name: z.string(),
        avatar: z.string(),
        level: z.number(),
        xp: z.number(),
        rank: z.number(),
        target: z.number(),
      })
    )
  
    const dataParsed = dataSchema.safeParse(dataResponseJSON)
    if (!dataParsed.success) return NextResponse.json(dataResponseJSON, { status: dataResponse.status })

    const data = dataParsed.data
  
    const geistSemiboldResponse = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/fonts/Geist-600.otf`)
    const geistSemiboldArrayBuffer = await geistSemiboldResponse.arrayBuffer()
  
    const geistSemibold: Font = {
      data: geistSemiboldArrayBuffer,
      name: "Geist",
      style: "normal",
      weight: 600,
    }

    const getOrdinal = (number: number): string => {
      if (number >= 11 && number <= 13) return number + "th"
      return (
        number +
        (["th", "st", "nd", "rd"][number % 10] || ["th", "st", "nd", "rd"][0]!)
      )
    }
  
    return new ImageResponse((
      <div style={{
        background: background,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "450px",
      }}>  
        {await Promise.all(data.map(async (user, index) => {
          const avatarResponse = await fetch(user.avatar)
          const avatarArrayBuffer = await avatarResponse.arrayBuffer()

          return (
            <div key={index} style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
              height: "60px",
            }}>
              {/* @ts-ignore */}
              <img src={avatarArrayBuffer} width={60} height={60} style={{
                borderRadius: "11.25px",
              }}/>
              <div style={{
                display: "flex",
                flexDirection: "column",
              }}>
                <span style={{
                  color: "#"+primaryColour,
                  fontSize: "20px",
                  fontWeight: "600",
                }}>{getOrdinal(user.rank)} Place</span>
                <span style={{
                  color: "#"+secondaryColour,
                  fontSize: "20px",
                  fontWeight: "600",
                }}>{user.username}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="-1 -1 34 34" style={{
                marginRight: "0px",
                marginLeft: "auto",
              }}>
                <g transform="rotate(-90 16 16)">
                  <circle cx="16" cy="16" r="15.9155" stroke={"#"+primaryColour} strokeWidth="2" fill="none"/>
                  <circle cx="16" cy="16" r="15.9155" stroke={"#"+secondaryColour} strokeWidth="2" strokeDasharray="100 100" strokeDashoffset={-((user.xp / user.target) * 100)} fill="none"/>
                </g>
                <span style={{
                  color: "#"+primaryColour,
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: "auto",
                }}>{user.level}</span>
              </svg>
            </div>
          )
        }))}
      </div>
    ), {
      width: 450,
      height: (data.length * 60) + ((data.length - 1) * 24) + 48,
      fonts: [geistSemibold],
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(error, { status: 500 })
  }
}
