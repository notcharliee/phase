import type { BaseEditor, Element, Path, Range, Text } from "slate"
import type { HistoryEditor } from "slate-history"
import type { ReactEditor } from "slate-react"

export type RichTextEditor = BaseEditor & ReactEditor & HistoryEditor

export interface RichTextFlags {
  decorations?: boolean
  mentions?: boolean
  channels?: boolean
  variables?: boolean
}

export type RichTextTransform = (
  path: Path,
  node: Text,
) => { element: Element; range: Range; offset: number }[]

export type RichTextRootElement = Extract<Element, { type: "text" }>

export type RichTextSerialiser = (value: [RichTextRootElement]) => string

export type RichTextDeserialiser = (value: string) => [RichTextRootElement]
