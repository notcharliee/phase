"use client"

import type { RenderElementProps } from "slate-react"

export interface TextElementNodeProps extends RenderElementProps {
  element: Extract<RenderElementProps["element"], { type: "text" }>
}

export function TextElementNode({
  attributes,
  children,
}: TextElementNodeProps) {
  return <span {...attributes}>{children}</span>
}
