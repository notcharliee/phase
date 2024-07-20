import { ImageBuilder } from "phasebot/builders"

import { getOrdinal } from "~/lib/utils"

import geist600 from "./fonts/Geist-600.otf"

interface RankCardProps {
  background: string | undefined
  level: string
  xp: string
  target: string
  rank: string
  username: string
  avatar: string
}

export const generateRankCard = (props: RankCardProps) =>
  new ImageBuilder(
    (
      <main
        style={{
          width: "548px",
          height: "192px",
          display: "flex",
          background: "rgba(8,8,8,0.25)",
        }}
      >
        {!!props.background && (
          <img
            src={props.background}
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
            src={props.avatar}
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
                  {getOrdinal(+props.rank)} Place
                </span>
                <span style={{ color: "#C0C0C0" }}>{props.username}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  textAlign: "right",
                }}
              >
                <span style={{ color: "#F8F8F8" }}>Level {props.level}</span>
                <span style={{ color: "#C0C0C0" }}>{props.xp} XP</span>
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
                  width: `${(+props.xp / +props.target) * 100}%`,
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
  )
    .setWidth(548)
    .setHeight(192)
    .setFonts([
      {
        data: geist600,
        name: "Geist",
        style: "normal",
        weight: 600,
      },
    ])
