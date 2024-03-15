/* eslint-disable @next/next/no-img-element */

import { Fragment } from "react"

import { type NextRequest } from "next/server"
import { ImageResponse } from "next/og"

import { absoluteURL, getOrdinal } from "@/lib/utils"

import { jsxifyText } from "./jsxify"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams

  const username = searchParams.get("username") ?? "username"
  const avatar = searchParams.get("avatar") ?? absoluteURL("/discord.png")
  const membercount = searchParams.get("membercount") ?? "1"

  const text = (
    searchParams.get("text") ??
    "Welcome **{username}**!\\nYou are our **{ord({membercount})}** member."
  )
    .replaceAll(/{username}/g, username)
    .replaceAll(/{membercount}/g, membercount)
    .replaceAll(/{ord\((\d+)\)}/g, (_, num) => getOrdinal(+num))

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
              height: "96px",
              width: "320px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              fontFamily: "Geist",
              fontSize: "24px",
              fontWeight: "600",
              letterSpacing: "-0.05em",
            }}
          >
            {text.split("\\n").map((line, i) => (
              <Fragment key={i}>
                {jsxifyText(line)}
                <br />
              </Fragment>
            ))}
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
