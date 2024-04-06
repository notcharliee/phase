/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og"
import { type NextRequest } from "next/server"

import { absoluteURL, getOrdinal } from "@/lib/utils"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams

  const username = searchParams.get("username") ?? "username"
  const avatar = searchParams.get("avatar") ?? absoluteURL("/discord.png")
  const rank = searchParams.get("rank") ?? "1"
  const level = searchParams.get("level") ?? "0"
  const xp = searchParams.get("xp") ?? "1"
  const target = searchParams.get("target") ?? "500"

  return new ImageResponse(
    (
      <main
        style={{
          width: "548px",
          height: "192px",
          display: "flex",
          background: "rgba(8,8,8,0.25)",
        }}
      >
        {searchParams.has("background") && (
          <img
            src={searchParams.get("background")!}
            alt=""
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "548px",
              height: "192px",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        )}
        <div
          style={{
            width: "500px",
            height: "144px",
            display: "flex",
            gap: "36px",
            margin: "24px",
            padding: "24px",
            borderRadius: "12px",
            background: "rgba(8,8,8,0.75)",
          }}
        >
          <img
            src={avatar}
            alt=""
            width={96}
            height={96}
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "8px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "Geist",
                fontSize: "24px",
                fontWeight: "600",
                letterSpacing: "-0.05em",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ color: "#F8F8F8" }}>
                  {getOrdinal(+rank)} Place
                </span>
                <span style={{ color: "#C0C0C0" }}>{username}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  textAlign: "right",
                }}
              >
                <span style={{ color: "#F8F8F8" }}>Level {level}</span>
                <span style={{ color: "#C0C0C0" }}>{xp} XP</span>
              </div>
            </div>
            <div
              style={{
                width: "320px",
                height: "18px",
                display: "flex",
                borderRadius: "18px",
                background: "#C0C0C0",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${(+xp / +target) * 100}%`,
                  height: "18px",
                  borderRadius: "18px",
                  background: "#F8F8F8",
                  position: "absolute",
                  top: "0",
                  left: "0",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    ),
    {
      width: 548,
      height: 192,
      fonts: [
        {
          data: await fetch(absoluteURL("/fonts/Geist-600.otf")).then((res) =>
            res.arrayBuffer().then((ab) => ab),
          ),
          name: "Geist",
          style: "normal",
          weight: 600,
        },
      ],
    },
  )
}
