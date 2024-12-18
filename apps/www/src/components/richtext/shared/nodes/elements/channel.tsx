"use client"

import { ChannelIcon } from "~/components/channel-icons"

import type { RenderElementProps } from "slate-react"

export interface ChannelElementNodeProps extends RenderElementProps {
  element: Extract<RenderElementProps["element"], { type: "channel" }>
}

export function ChannelElementNode({
  element,
  attributes,
  children,
}: ChannelElementNodeProps) {
  return (
    <span {...attributes} className="h-4 cursor-default">
      <span className="text-foreground bg-foreground/25 whitespace-nowrap rounded-[4px] px-1">
        <span className="mr-0.5 inline-block h-4 align-middle">
          <ChannelIcon
            channelType={element.data.type}
            className="my-auto size-3.5"
          />
        </span>
        <span className="leading-none">{element.data.name}</span>
      </span>
      {children}
    </span>
  )
}
