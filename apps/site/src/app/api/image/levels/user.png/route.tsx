import { Font } from "next/dist/compiled/@vercel/og/satori"
import { NextRequest, NextResponse } from "next/server"
import { ImageResponse } from "next/og"
import { env } from '@/env'
import { z } from "zod"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("user")
  const guildId = request.nextUrl.searchParams.get("guild")

  try {
    const dataResponse = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/levels/user?user=${userId}&guild=${guildId}&t=${Date.now()}`)
    const dataResponseJSON = await dataResponse.json() as unknown
  
    const dataSchema = z.object({
      id: z.string(),
      username: z.string(),
      global_name: z.string(),
      avatar: z.string(),
      level: z.number(),
      xp: z.number(),
      rank: z.number(),
      target: z.number(),
    })
  
    const dataParsed = dataSchema.safeParse(dataResponseJSON)
    if (!dataParsed.success) return NextResponse.json(dataResponseJSON, { status: dataResponse.status })

    const data = dataParsed.data

    const avatarResponse = await fetch(data.avatar)
    const avatarArrayBuffer = await avatarResponse.arrayBuffer()
  
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
        background: "#080808",
        padding: "24px",
        display: "flex",
        flexDirection: "row",
        gap: "36px",
        alignItems: "center",
        justifyContent: "center",
        width: "450px",
        position: "relative",
      }}>  
        {/* @ts-ignore */}
        <img src={avatarArrayBuffer} width={96} height={96} style={{
          borderRadius: "18px",
        }}/>
        <div style={{
          background: "#f8f8f8",
          borderRadius: "9px",
          padding: "6px 9px 6px 9px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          height: "27px",
          position: "absolute",
          left: "87.75px",
          top: "99.75px",
        }}>
          <span style={{
            color: "#080808",
            textAlign: "center",
            fontFamily: "Geist",
            fontSize: "16px",
            lineHeight: "100%",
            fontWeight: "600",
            position: "relative",
          }}>{getOrdinal(data.rank)}</span>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          alignSelf: "stretch",
          flex: "1",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            alignSelf: "stretch",
            flexShrink: "0",
            position: "relative",
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0px",
              alignItems: "flex-start",
              justifyContent: "center",
              flexShrink: "0",
              position: "relative",
            }}>
              <span style={{
                color: "#f8f8f8",
                textAlign: "left",
                fontSize: "20px",
                fontWeight: "600",
              }}>{data.global_name}</span>
              <span style={{
                color: "#c0c0c0",
                textAlign: "left",
                fontSize: "20px",
                fontWeight: "600",
              }}>{data.username}</span>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
            }}>
              <div style={{
                display: "flex",
                color: "#f8f8f8",
                textAlign: "right",
                fontSize: "20px",
                fontWeight: "600",
              }}>Level {data.level}</div>
              <div style={{
                display: "flex",
                color: "#c0c0c0",
                textAlign: "right",
                fontSize: "20px",
                fontWeight: "600",
              }}>{data.xp} XP</div>
            </div>
          </div>
          <div style={{
            background: "#c0c0c0",
            borderRadius: "18px",
            alignSelf: "stretch",
            height: "18px",
            position: "relative",
            display: "flex"
          }}>
            <div style={{
              background: "#f8f8f8",
              borderRadius: "18px",
              width: `${(data.xp / data.target) * 100}%`,
              height: "18px",
              position: "absolute",
              left: "0px",
              top: "0px",
            }}/>
          </div>
        </div>
      </div>
    ), {
      width: 450,
      height: 144,
      fonts: [geistSemibold],
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(error, { status: 500 })
  }
}
