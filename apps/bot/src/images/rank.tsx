import { ImageBuilder } from "phasebot/builders"

import geist500 from "./fonts/Geist-500.otf"
import geist700 from "./fonts/Geist-700.otf"

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
  return new ImageBuilder(
    (
      <div
        tw="flex flex-col font-bold text-[#f8f8f8]"
        style={{
          fontFamily: "Geist",
          letterSpacing: "-0.04em",
          lineHeight: "1.25em",
        }}
      >
        <div tw="w-[900px] h-[315px] flex relative rounded-t-[36px] overflow-hidden">
          {props.bannerImage.startsWith("url(") ? (
            <img
              tw="w-[900px] h-[300px]"
              src={props.bannerImage.replace("url(", "").replace(")", "")}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              tw="w-[900px] h-[300px]"
              style={{ backgroundImage: props.bannerImage }}
            />
          )}
          <svg
            width="900"
            height="115"
            viewBox="0 0 900 115"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
            }}
          >
            <path
              d="M899.999 89.0048L883.299 91.2572C866.7 93.5096 833.3 98.0145 800 85.4009C766.701 72.7121 733.302 42.98 700.002 34.9463C666.702 26.9126 633.301 40.7275 600.001 57.0952C566.701 73.4629 533.302 92.5336 500.002 98.1647C466.702 103.796 433.303 95.9873 400.003 81.2714C366.704 66.4804 333.307 44.7068 300.007 30.2162C266.708 15.6504 233.308 8.44262 200.009 3.93774C166.709 -0.567129 133.309 -2.36909 100.01 4.91379C66.7102 12.1967 33.3105 28.4142 16.7107 36.5981L0.010997 44.7068L1.08534e-05 115H16.6998C33.2996 115 66.6992 115 99.9988 115C133.298 115 166.698 115 199.998 115C233.297 115 266.697 115 299.996 115C333.296 115 366.696 115 399.995 115C433.295 115 466.694 115 499.994 115C533.294 115 566.693 115 599.993 115C633.292 115 666.692 115 699.991 115C733.291 115 766.691 115 799.99 115C833.29 115 866.689 115 883.289 115H899.989L899.999 89.0048Z"
              fill="#101010"
            />
          </svg>
          <img
            src={props.avatarUrl}
            tw="w-[175px] h-[175px] rounded-full absolute bottom-0 left-[56px] border-[16px] border-[#101010] bg-[#101010]"
          />
        </div>
        <div
          tw="w-[900px] h-[265px] flex flex-col bg-[#101010] px-[72px] pt-6 pb-12 rounded-b-[36px]"
          style={{ gap: "36px" }}
        >
          <div tw="w-[756px] h-[85px] flex justify-between">
            <div tw="flex flex-col items-start">
              <div tw="font-bold text-[36px]">{props.displayName}</div>
              <div tw="font-medium text-[32px] text-[#C0C0C0]">
                {props.username}
              </div>
            </div>
            <div tw="flex flex-col items-end">
              <div tw="font-bold text-[36px]">{`Rank #${props.rank}`}</div>
              <div tw="font-medium text-[32px] text-[#C0C0C0]">
                {`Level ${props.level}`}
              </div>
            </div>
          </div>
          <div tw="w-[756px] h-[72px] flex rounded-[36px] relative overflow-hidden border-[4px] border-[#282828]">
            {props.bannerImage.startsWith("url(") ? (
              <img
                tw="h-full absolute top-0 left-0"
                src={props.bannerImage.replace("url(", "").replace(")", "")}
                style={{
                  width: `${(+props.currentXp / +props.targetXp) * 100}%`,
                  objectFit: "cover",
                  filter: "blur(4px) brightness(0.9)",
                }}
              />
            ) : (
              <div
                tw="h-full absolute top-0 left-0"
                style={{
                  width: `${(+props.currentXp / +props.targetXp) * 100}%`,
                  backgroundImage: props.bannerImage,
                }}
              />
            )}
            <div tw="w-full h-full flex justify-between items-center px-[36px] py-[20px] text-[32px] leading-none font-medium">
              <div>{`${props.currentXp} XP`}</div>
              <div>{`${props.targetXp} XP`}</div>
            </div>
          </div>
        </div>
      </div>
    ),
  )
    .setWidth(900)
    .setHeight(580)
    .setFonts([
      {
        data: geist500,
        name: "Geist",
        style: "normal",
        weight: 500,
      },
      {
        data: geist700,
        name: "Geist",
        style: "normal",
        weight: 700,
      },
    ])
}
