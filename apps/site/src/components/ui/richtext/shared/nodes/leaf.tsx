"use client"

import { cn } from "~/lib/utils"

import type { RenderLeafProps } from "slate-react"

export function LeafNode({ attributes, children, leaf }: RenderLeafProps) {
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
