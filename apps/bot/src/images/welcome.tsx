import { ImageBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"
import dedent from "dedent"

import { tw } from "~/lib/tw"
import { numberToOrdinal } from "~/lib/utils/formatting"

import geistBold from "./fonts/geist-bold.otf"
import geistMedium from "./fonts/geist-medium.otf"

import type { Client, GuildMember } from "discord.js"

interface WelcomeCardProps {
  client: Client
  member: GuildMember
}

export async function generateWelcomeCard(props: WelcomeCardProps) {
  const guild = props.member.guild
  const guildDoc = props.client.stores.guilds.get(guild.id)

  if (!guildDoc) {
    throw new Error("Guild not found in the database")
  }

  const moduleConfig = guildDoc.modules?.[ModuleId.WelcomeMessages]

  // if (!moduleConfig?.enabled) {
  //   throw new Error("Welcome Messages are not enabled in this guild")
  // }

  // if (!moduleConfig.card.enabled) {
  //   throw new Error("Welcome card is not enabled or has no background")
  // }

  const backgroundImage =
    (moduleConfig?.card.background
      ? await fetch(moduleConfig.card.background)
          .then(async (res) => {
            if (res.headers.get("content-type")?.startsWith("image")) {
              const buffer = await res.arrayBuffer()
              return `url(data:${res.headers.get("content-type")};base64,${Buffer.from(buffer).toString("base64")})`
            }
            return undefined
          })
          .catch(() => undefined)
      : undefined) ?? "linear-gradient(to right, #282828, #282828)"

  const text = dedent(`
    Welcome, **${props.member.user.username}**
    You are our **${numberToOrdinal(guild.memberCount)}** member
  `)

  const width = 600
  const height = 192

  return new ImageBuilder(
    (
      <div
        style={tw`text-foreground relative flex h-full w-full items-center justify-center font-['Geist'] font-medium leading-5 tracking-tighter`}
      >
        {backgroundImage.startsWith("url(") ? (
          <img
            src={backgroundImage.replace("url(", "").replace(")", "")}
            style={tw`absolute left-0 top-0 h-full w-full object-cover`}
          />
        ) : (
          <div
            style={{
              ...tw`absolute left-0 top-0 h-full w-full`,
              backgroundImage,
            }}
          />
        )}
        <div
          style={{
            ...tw`bg-background/75 flex gap-6 rounded-xl p-6`,
            width: `${width - 24 * 2}px`,
            height: `${height - 24 * 2}px`,
          }}
        >
          <img
            src={props.member.displayAvatarURL({
              extension: "png",
              size: 128,
            })}
            style={tw`bg-background border-border h-24 w-24 rounded-full border-[8px]`}
          />
          <div
            style={tw`flex h-full max-w-full flex-col justify-center text-2xl`}
          >
            {text.split("\n").map(markdownToJSX)}
          </div>
        </div>
      </div>
    ),
  )
    .setWidth(width)
    .setHeight(height)
    .setFonts([
      { name: "Geist", weight: 500, data: geistMedium },
      { name: "Geist", weight: 700, data: geistBold },
    ])
}

/**
 * Transforms VERY basic markdown strings into JSX.
 */
function markdownToJSX(markdown: string, index?: number) {
  const boldRegex = /\*\*(.*?)\*\*/g

  const parts: React.ReactNode[] = []
  let remainingText = markdown

  while (remainingText.length > 0) {
    const boldMatch = boldRegex.exec(remainingText)

    if (boldMatch) {
      const [fullMatch, innerText] = boldMatch
      const startIndex = remainingText.indexOf(fullMatch)
      const endIndex = startIndex + fullMatch.length

      if (startIndex > 0) {
        parts.push(
          <span key={startIndex}>{remainingText.slice(0, startIndex)}</span>,
        )
      }

      parts.push(
        <span style={tw`text-foreground font-bold`} key={startIndex}>
          {innerText}
        </span>,
      )

      remainingText = remainingText.slice(endIndex)
    } else {
      parts.push(<span key={Math.random()}>{remainingText}</span>)
      remainingText = ""
    }
  }

  return (
    <div
      key={`line-${index}`}
      style={tw`text-muted-foreground flex w-full whitespace-pre-wrap`}
    >
      {parts}
    </div>
  )
}
