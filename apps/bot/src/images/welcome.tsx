import { ImageBuilder } from "@phasejs/image"

import { ModuleId } from "@repo/utils/modules"
import dedent from "dedent"

import { tw } from "~/lib/tw"
import { numberToOrdinal } from "~/lib/utils/formatting"

import { geistBoldFile, geistMediumFile } from "~/assets/fonts"

import type { ImageFont } from "@phasejs/image"
import type { Client, GuildMember } from "discord.js"

export async function generateWelcomeCard(client: Client, member: GuildMember) {
  const guild = member.guild
  const guildDoc = client.stores.guilds.get(guild.id)

  if (!guildDoc) {
    throw new Error("Guild not found in the database")
  }

  const moduleConfig = guildDoc.modules?.[ModuleId.WelcomeMessages]

  const fallbackGradient = "linear-gradient(to right, #282828, #282828)"

  const backgroundImage = moduleConfig?.card.background
    ? await fetchBackgroundImage(moduleConfig.card.background, fallbackGradient)
    : fallbackGradient

  const text = dedent(`
    Welcome, **${member.user.username}**
    You are our **${numberToOrdinal(guild.memberCount)}** member
  `)

  const geistMedium = await geistMediumFile.arrayBuffer()
  const geistBold = await geistBoldFile.arrayBuffer()

  const fonts: ImageFont[] = [
    { name: "Geist", weight: 700, data: geistBold },
    { name: "Geist", weight: 500, data: geistMedium },
  ]

  const width = 600
  const height = 192

  const element = (
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
          src={member.displayAvatarURL({
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
  )

  return await new ImageBuilder()
    .setFonts(fonts)
    .setWidth(width)
    .setHeight(height)
    .setElement(element)
    .build()
}

async function fetchBackgroundImage(url: string, fallback: string) {
  try {
    const response = await fetch(url)

    const contentType = response.headers.get("content-type")
    if (!contentType?.startsWith("image")) return fallback

    const ab = await response.arrayBuffer()
    const buffer = Buffer.from(ab)

    return `url(data:${contentType};base64,${buffer.toString("base64")})`
  } catch {
    return fallback
  }
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
