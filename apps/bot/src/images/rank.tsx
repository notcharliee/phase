import { ImageBuilder } from "@repo/image"

import { tw } from "~/lib/tw"

import geistBold from "./fonts/geist-bold.otf"
import geistMedium from "./fonts/geist-medium.otf"

interface RankCardProps {
  username: string
  displayName: string
  avatarUrl: string
  rank: number
  level: number
  currentXp: number
  targetXp: number
  bannerImage: string
}

export const generateRankCard = (props: RankCardProps) => {
  return new ImageBuilder()
    .setElement(
      <div
        style={tw`text-foreground flex h-full w-full flex-col font-['Geist'] font-bold leading-5 tracking-tighter`}
      >
        <div
          style={tw`relative flex h-80 w-full overflow-hidden rounded-t-3xl`}
        >
          {props.bannerImage.startsWith("url(") ? (
            <img
              src={props.bannerImage.replace("url(", "").replace(")", "")}
              style={tw`h-80 w-full object-cover`}
            />
          ) : (
            <div
              style={{
                ...tw`h-80 w-full`,
                backgroundImage: props.bannerImage,
              }}
            />
          )}
          <svg
            style={tw`text-background absolute bottom-0 left-0 h-28 w-full`}
            viewBox="0 0 900 115"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <path
              d="M899.999 89.0048L883.299 91.2572C866.7 93.5096 833.3 98.0145 800 85.4009C766.701 72.7121 733.302 42.98 700.002 34.9463C666.702 26.9126 633.301 40.7275 600.001 57.0952C566.701 73.4629 533.302 92.5336 500.002 98.1647C466.702 103.796 433.303 95.9873 400.003 81.2714C366.704 66.4804 333.307 44.7068 300.007 30.2162C266.708 15.6504 233.308 8.44262 200.009 3.93774C166.709 -0.567129 133.309 -2.36909 100.01 4.91379C66.7102 12.1967 33.3105 28.4142 16.7107 36.5981L0.010997 44.7068L1.08534e-05 115H16.6998C33.2996 115 66.6992 115 99.9988 115C133.298 115 166.698 115 199.998 115C233.297 115 266.697 115 299.996 115C333.296 115 366.696 115 399.995 115C433.295 115 466.694 115 499.994 115C533.294 115 566.693 115 599.993 115C633.292 115 666.692 115 699.991 115C733.291 115 766.691 115 799.99 115C833.29 115 866.689 115 883.289 115H899.989L899.999 89.0048Z"
              fill="currentColor"
            />
          </svg>
          <img
            src={props.avatarUrl}
            style={tw`border-background bg-background absolute bottom-0 left-16 h-48 w-48 rounded-full border-[16px]`}
          />
        </div>
        <div
          style={tw`bg-background flex w-full flex-col gap-10 rounded-b-3xl px-16 pb-12 pt-6`}
        >
          <div style={tw`flex h-20 w-full justify-between`}>
            <div style={tw`flex flex-col items-start gap-1`}>
              <div style={tw`text-4xl font-bold`}>{props.displayName}</div>
              <div style={tw`text-muted-foreground text-3xl font-medium`}>
                {props.username}
              </div>
            </div>
            <div style={tw`flex flex-col items-end gap-1`}>
              <div style={tw`text-4xl font-bold`}>{`Rank #${props.rank}`}</div>
              <div style={tw`text-muted-foreground text-3xl font-medium`}>
                {`Level ${props.level}`}
              </div>
            </div>
          </div>
          <div
            style={tw`border-border flex h-20 w-full overflow-hidden rounded-full border-4`}
          >
            <div
              style={tw`relative flex h-full w-full items-center justify-between`}
            >
              <div
                style={tw`text-foreground bg-background absolute flex h-full w-full items-center justify-between px-9 text-3xl font-bold`}
              >
                <div>{`${props.currentXp} XP`}</div>
                <div>{`${props.targetXp} XP`}</div>
              </div>
              <div
                style={{
                  ...tw`text-background absolute flex h-full w-full items-center justify-between px-9 text-3xl font-bold`,
                  clipPath: `inset(0 ${100 - (+props.currentXp / +props.targetXp) * 100}% 0 0)`,
                  background: `linear-gradient(to right, white ${(+props.currentXp / +props.targetXp) * 100}%, transparent ${(+props.currentXp / +props.targetXp) * 100}%)`,
                }}
              >
                <div>{`${props.currentXp} XP`}</div>
                <div>{`${props.targetXp} XP`}</div>
              </div>
            </div>
          </div>
        </div>
      </div>,
    )
    .setWidth(900)
    .setHeight(592)
    .addFont({ name: "Geist", weight: 500, data: geistMedium })
    .addFont({ name: "Geist", weight: 700, data: geistBold })
    .build()
}
