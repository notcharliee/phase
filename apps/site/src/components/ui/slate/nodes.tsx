"use client"

import { ChannelType } from "discord-api-types/v10"

import { cn } from "~/lib/utils"

import { ChannelIcon } from "./icons"

import type {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from "slate-react"

// utility types //

interface CustomElements {
  text: TextElement
  channel: ChannelElement
  mention: MentionElement
}

type CustomElementProps<T extends keyof CustomElements> = RenderElementProps & {
  element: CustomElements[T]
}

// custom placeholder //

export function CustomPlaceholderNode({ children }: RenderPlaceholderProps) {
  return (
    <>
      <span
        data-slate-placeholder={true}
        contentEditable={false}
        suppressContentEditableWarning={true}
        className="text-muted-foreground pointer-events-none absolute select-none text-sm"
      >
        {children}
      </span>
      {navigator.userAgent.includes("Android") && <br />}
    </>
  )
}

// custom leaf //

export interface CustomLeaf {
  text: string
  h1?: boolean
  h2?: boolean
  h3?: boolean
  subtext?: boolean
  bold?: boolean
  italic?: boolean
  strike?: boolean
  underline?: boolean
  spoiler?: boolean
  code?: boolean
  codeblock?: boolean
  mention?: boolean
  channel?: boolean
  punctuation?: boolean
}

export function CustomLeafNode({
  attributes,
  children,
  leaf,
}: RenderLeafProps & {
  leaf: CustomLeaf
}) {
  return (
    <span
      {...attributes}
      spellCheck={!leaf.codeblock && !leaf.code}
      className={cn(
        leaf.h1 && "text-lg font-bold",
        leaf.h2 && "text-base font-bold",
        leaf.h3 && "text-sm font-bold",
        leaf.subtext && "text-muted-foreground text-xs font-medium",
        leaf.bold && "font-bold",
        leaf.italic && "italic",
        leaf.strike && "line-through",
        leaf.underline && "underline underline-offset-2",
        leaf.spoiler && "bg-muted text-muted-foreground rounded-[4px] px-1",
        leaf.code && "text-muted-foreground font-mono text-xs leading-5",
        leaf.codeblock && "text-muted-foreground font-mono text-xs leading-5",
        leaf.punctuation && "text-muted-foreground bg-transparent px-px",
        leaf.punctuation && leaf.strike && "no-underline",
        leaf.punctuation && leaf.underline && "no-underline",
        leaf.punctuation && leaf.code && "font-sans text-sm",
        leaf.punctuation && leaf.codeblock && "font-sans text-sm",
        (leaf.mention ?? leaf.channel) && "text-red-500",
      )}
    >
      {children}
    </span>
  )
}

// custom element //

export type CustomElement = TextElement | ChannelElement | MentionElement

export function CustomElementNode(
  props: CustomElementProps<keyof CustomElements>,
) {
  if (props.element.type === "channel") {
    return <ChannelElementNode {...(props as CustomElementProps<"channel">)} />
  } else if (props.element.type === "mention") {
    return <MentionElementNode {...(props as CustomElementProps<"mention">)} />
  } else {
    return <TextElementNode {...(props as CustomElementProps<"text">)} />
  }
}

// text element //

export interface TextElement {
  type: "text"
  children: (CustomLeaf | ChannelElement | MentionElement)[]
}

export function TextElementNode({
  attributes,
  children,
}: CustomElementProps<"text">) {
  return (
    <div className="text-foreground text-sm" {...attributes}>
      {children}
    </div>
  )
}

// channel element //

export const allowedChannelTypes = [
  ChannelType.GuildText,
  ChannelType.GuildAnnouncement,
  ChannelType.GuildForum,
  ChannelType.GuildMedia,
  ChannelType.GuildVoice,
  ChannelType.GuildStageVoice,
] as const

export type AllowedChannelType = (typeof allowedChannelTypes)[number]

export interface ChannelElement {
  type: "channel"
  children: { text: string }[]
  data: {
    id: string
    name: string
    type: AllowedChannelType
  }
}

export function ChannelElementNode({
  attributes,
  children,
  element,
}: CustomElementProps<"channel">) {
  const channelName = element.data.name
  const channelType = element.data.type

  return (
    <span {...attributes} className="h-4 cursor-default">
      <span className="text-foreground bg-foreground/25 whitespace-nowrap rounded-[4px] px-1">
        <span className="mr-0.5 inline-block h-4 align-middle">
          <ChannelIcon type={channelType} />
        </span>
        <span className="font-medium leading-none">{channelName}</span>
      </span>
      {children}
    </span>
  )
}

// mention element //

export interface MentionElement {
  type: "mention"
  children: { text: string }[]
  data: {
    id: string
    name: string
    colour: string
    type: "role" | "user" | "everyone" | "here"
  }
}

export function MentionElementNode({
  attributes,
  children,
  element,
}: CustomElementProps<"mention">) {
  const mentionName = element.data.name
  const mentionColour = element.data.colour
  const mentionBackgroundColour = mentionColour + "40"

  return (
    <span {...attributes} className="h-4 cursor-default">
      <span
        className="whitespace-nowrap rounded-[4px] px-1"
        style={{
          color: mentionColour,
          backgroundColor: mentionBackgroundColour,
        }}
      >
        <span className="font-medium leading-none">{`@${mentionName}`}</span>
      </span>
      {children}
    </span>
  )
}
