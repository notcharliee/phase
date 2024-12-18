"use client"

import { ChannelElementNode } from "~/components/richtext/shared/nodes/elements/channel"
import { MentionElementNode } from "~/components/richtext/shared/nodes/elements/mention"
import { TextElementNode } from "~/components/richtext/shared/nodes/elements/text"

import type { ChannelElementNodeProps } from "~/components/richtext/shared/nodes/elements/channel"
import type { MentionElementNodeProps } from "~/components/richtext/shared/nodes/elements/mention"
import type { TextElementNodeProps } from "~/components/richtext/shared/nodes/elements/text"
import type { RenderElementProps } from "slate-react"

export function ElementNode(props: RenderElementProps) {
  switch (props.element.type) {
    case "channel": {
      return <ChannelElementNode {...(props as ChannelElementNodeProps)} />
    }
    case "mention": {
      return <MentionElementNode {...(props as MentionElementNodeProps)} />
    }
    default: {
      return <TextElementNode {...(props as TextElementNodeProps)} />
    }
  }
}
