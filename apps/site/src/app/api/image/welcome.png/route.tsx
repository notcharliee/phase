import { type NextRequest } from "next/server"
import { ImageResponse } from "next/og"

import { absoluteURL } from "@/lib/utils"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams

  const username = searchParams.get("username") ?? "username"
  const avatar = searchParams.get("avatar") ?? absoluteURL("/discord.png")
  const membercount = searchParams.get("membercount") ?? "1"

  const background = searchParams.has("background")
    ? `url(${searchParams.get("background")})`
    : "rgb(8,8,8)"

  return new ImageResponse(
    (
      <main
        style={{
          width: "1200px",
          height: "448px",
          display: "flex",
          gap: "6rem",
          padding: "6rem",
          background,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "1200px",
            height: "448px",
            background: searchParams.has("background")
              ? "rgba(8,8,8,0.5)"
              : "rgba(8,8,8,0)",
          }}
        ></div>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={avatar}
          style={{
            height: "16rem",
            width: "16rem",
            borderRadius: "2rem",
            borderWidth: "0.5rem",
            borderColor: "rgb(248,248,248)",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "3rem",
            flexDirection: "column",
            justifyContent: "center",
            fontSize: "3rem",
            fontWeight: "700",
            lineHeight: "0.8",
            letterSpacing: "-0.05em",
            color: "rgb(192,192,192)",
          }}
        >
          <div
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            <span>welcome</span>
            <span style={{ color: "rgb(248,248,248)", fontSize: "4rem" }}>
              {username}
            </span>
          </div>
          <span>member #{membercount}</span>
        </div>
      </main>
    ),
    {
      width: 1200,
      height: 448,
      fonts: [
        {
          data: await fetch(absoluteURL("/fonts/Geist-700.otf")).then((res) =>
            res.arrayBuffer().then((ab) => ab),
          ),
          name: "Geist",
          style: "normal",
          weight: 700,
        },
      ],
    },
  )
}
