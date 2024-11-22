import { ImageBuilder } from "@phasejs/image"

import { numberToOrdinal } from "~/lib/utils/formatting"

import geistBold from "./fonts/geist-bold.otf"
import geistMedium from "./fonts/geist-medium.otf"

interface DataProps {
  id: string
  username: string
  global_name: string
  avatar: string
  level: number
  xp: number
  rank: number
  target: number
}

interface LeaderboardCardProps {
  data: DataProps[]
}

export const generateLeaderboardCard = (props: LeaderboardCardProps) => {
  return new ImageBuilder()
    .setElement(
      <div
        style={{
          background: "#080808",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "450px",
        }}
      >
        {props.data.map((user, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
              height: "60px",
            }}
          >
            <img
              src={user.avatar}
              width={60}
              height={60}
              style={{
                borderRadius: "11.25px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "#f8f8f8",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {numberToOrdinal(user.rank)} Place
              </span>
              <span
                style={{
                  color: "#c0c0c0",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {user.username}
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={60}
              height={60}
              viewBox="-1 -1 34 34"
              style={{
                marginRight: "0px",
                marginLeft: "auto",
              }}
            >
              <g transform="rotate(-90 16 16)">
                <circle
                  cx="16"
                  cy="16"
                  r="15.9155"
                  stroke={"#f8f8f8"}
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="15.9155"
                  stroke={"#c0c0c0"}
                  strokeWidth="2"
                  strokeDasharray="100 100"
                  strokeDashoffset={-((user.xp / user.target) * 100)}
                  fill="none"
                />
              </g>
              <span
                style={{
                  color: "#f8f8f8",
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: "auto",
                }}
              >
                {user.level}
              </span>
            </svg>
          </div>
        ))}
      </div>,
    )
    .setWidth(450)
    .setHeight(props.data.length * 60 + (props.data.length - 1) * 24 + 48)
    .addFont({ name: "Geist", weight: 500, data: geistMedium })
    .addFont({ name: "Geist", weight: 700, data: geistBold })
    .build()
}
