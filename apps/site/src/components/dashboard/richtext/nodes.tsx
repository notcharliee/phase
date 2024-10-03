"use client"

import React from "react"

import { ChannelIcon } from "~/components/channel-icons"

import { cn } from "~/lib/utils"

import type { Text } from "slate"
import type {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from "slate-react"

interface PlaceholderNodeProps extends RenderPlaceholderProps {}

export function PlaceholderNode({ children }: PlaceholderNodeProps) {
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

interface LeafNodeProps extends RenderLeafProps, Omit<Text, "text"> {}

export function LeafNode({ attributes, children, leaf }: LeafNodeProps) {
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
      )}
    >
      {children}
    </span>
  )
}

interface ElementNodeProps extends RenderElementProps {}

export function ElementNode({
  attributes,
  children,
  element,
}: ElementNodeProps) {
  if (element.type === "text") {
    return <span {...attributes}>{children}</span>
  } else if (element.type === "channel") {
    return (
      <span {...attributes} className="h-4 cursor-default">
        <span className="text-foreground bg-foreground/25 whitespace-nowrap rounded-[4px] px-1">
          <span className="mr-0.5 inline-block h-4 align-middle">
            <ChannelIcon type={element.data.type} />
          </span>
          <span className="leading-none">{element.data.name}</span>
        </span>
        {children}
      </span>
    )
  } else {
    return (
      <span {...attributes} className="h-4 cursor-default">
        <span
          className="whitespace-nowrap rounded-[4px] px-1"
          style={{
            color: element.data.colour,
            backgroundColor: element.data.colour + "40",
          }}
        >
          <span className="leading-none">{"@" + element.data.name}</span>
        </span>
        {children}
      </span>
    )
  }
}
