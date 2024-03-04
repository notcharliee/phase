import { NextRequest } from "next/server"
import { ImageResponse } from "next/og"

import { absoluteURL } from "@/lib/utils"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams

  const title = searchParams.get("title") || "Hello, World!"
  const description = searchParams.get("description") || "This is a description"

  return new ImageResponse(
    (
      <main
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: "99px",
          paddingBottom: "99px",
          paddingLeft: "120px",
          paddingRight: "120px",
          backgroundColor: "rgb(8,8,8)",
          letterSpacing: "-0.05em",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "48px",
          }}
        >
          {/* prettier-ignore */}
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="48" cy="48" r="48" fill="#F8F8F8"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M91.7118 67.8598C83.8206 74.3815 73.7838 78.2858 62.8571 78.2858C37.452 78.2858 16.8571 57.1793 16.8571 31.143C16.8571 22.1977 19.2881 13.8344 23.51 6.70898C9.43343 15.0759 0 30.4364 0 48.0001C0 74.5098 21.4903 96.0001 48 96.0001C67.4267 96.0001 84.158 84.4594 91.7118 67.8598Z" fill="#B2B2B2"/>
            <circle cx="38.8571" cy="69.7143" r="6.42857" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="1.42857"/>
            <circle cx="20.7551" cy="48" r="3.39286" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="1.42857"/>
            <circle cx="50.7143" cy="7.28568" r="2.71429" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="1.14286"/>
            <circle cx="56.7143" cy="30.7143" r="5.28571" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="1.14286"/>
            <circle cx="79" cy="47.2857" r="10.7143" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="1.14286"/>
            <circle cx="51.4286" cy="50" r="6" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="1.14286"/>
            <circle cx="31.4285" cy="19.7143" r="4.28571" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="1.14286"/>
            <circle cx="35.1428" cy="37.1429" r="2.28571" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="1.14286"/>
          </svg>
          <span
            style={{
              fontFamily: "Geist",
              fontWeight: 700,
              fontSize: "96px",
              lineHeight: "96px",
              color: "#F8F8F8",
            }}
          >
            Phase
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "48px",
          }}
        >
          <div
            style={{
              fontFamily: "Geist Mono",
              fontWeight: 700,
              fontSize: "68.27px",
              lineHeight: "48px",
              color: "#F8F8F8",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "Geist Mono",
              fontWeight: 400,
              fontSize: "48px",
              lineHeight: "48px",
              color: "#C0C0C0",
            }}
          >
            {description}
          </div>
        </div>
        {/* prettier-ignore */}
        <svg style={{
          position: "absolute",
          top: 0,
          left: 0,
        }} width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5">
          <line x1="72.25" x2="72.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="120.25" x2="120.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="168.25" x2="168.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="216.25" x2="216.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="264.25" x2="264.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="312.25" x2="312.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="360.25" x2="360.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="408.25" x2="408.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="456.25" x2="456.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="504.25" x2="504.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="552.25" x2="552.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="600.25" x2="600.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="648.25" x2="648.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="696.25" x2="696.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="744.25" x2="744.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="792.25" x2="792.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="840.25" x2="840.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="888.25" x2="888.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="936.25" x2="936.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="984.25" x2="984.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="1032.25" x2="1032.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="1080.25" x2="1080.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="1128.25" x2="1128.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="1176.25" x2="1176.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line x1="24.25" x2="24.25" y2="630" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="626.75" x2="1200" y2="626.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="578.75" x2="1200" y2="578.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="530.75" x2="1200" y2="530.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="482.75" x2="1200" y2="482.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="434.75" x2="1200" y2="434.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="386.75" x2="1200" y2="386.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="338.75" x2="1200" y2="338.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="290.75" x2="1200" y2="290.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="242.75" x2="1200" y2="242.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="194.75" x2="1200" y2="194.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="146.75" x2="1200" y2="146.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="98.75" x2="1200" y2="98.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="50.75" x2="1200" y2="50.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          <line y1="2.75" x2="1200" y2="2.75" stroke="white" strokeOpacity="0.25" strokeWidth="0.5"/>
          </g>
        </svg>
      </main>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          data: await fetch(absoluteURL("/fonts/Geist-700.otf")).then((res) =>
            res.arrayBuffer().then((ab) => ab),
          ),
          name: "Geist",
          style: "normal",
          weight: 700,
        },
        {
          data: await fetch(absoluteURL("/fonts/GeistMono-700.otf")).then(
            (res) => res.arrayBuffer().then((ab) => ab),
          ),
          name: "Geist Mono",
          style: "normal",
          weight: 700,
        },
        {
          data: await fetch(absoluteURL("/fonts/GeistMono-400.otf")).then(
            (res) => res.arrayBuffer().then((ab) => ab),
          ),
          name: "Geist Mono",
          style: "normal",
          weight: 400,
        },
      ],
    },
  )
}
