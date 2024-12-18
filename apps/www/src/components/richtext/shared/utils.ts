import cloneDeep from "lodash.clonedeep"
import { Editor, Element, Range, Text } from "slate"

import type {
  RichTextEditor,
  RichTextFlags,
  RichTextRootElement,
} from "~/components/richtext/shared/types"
import type { BasePoint } from "slate"
import type { ReactEditor } from "slate-react"

// default flags //

export const defaultRichTextFlags = {
  input: {
    decorations: true,
    variables: true,
  },
  textarea: {
    decorations: true,
    mentions: true,
    channels: true,
    variables: true,
  },
} satisfies Record<string, RichTextFlags>

// type guards //

export function isText(descendant: unknown): descendant is Text {
  return Text.isText(descendant)
}

export function isElement(descendant: unknown): descendant is Element {
  return Element.isElement(descendant)
}

export function isRootElement(
  descendant: unknown,
): descendant is RichTextRootElement {
  return isElement(descendant) && descendant.type === "text"
}

// current word and range functions //

const getLeftChar = (editor: ReactEditor, point: BasePoint) => {
  const end = Range.end(editor.selection!)
  return Editor.string(editor, {
    anchor: {
      path: end.path,
      offset: point.offset - 1,
    },
    focus: {
      path: end.path,
      offset: point.offset,
    },
  })
}

const getRightChar = (editor: ReactEditor, point: BasePoint) => {
  const end = Range.end(editor.selection!)
  return Editor.string(editor, {
    anchor: {
      path: end.path,
      offset: point.offset,
    },
    focus: {
      path: end.path,
      offset: point.offset + 1,
    },
  })
}

export const getCurrentWord = (
  editor: RichTextEditor,
  flags: RichTextFlags,
) => {
  const { selection } = editor
  if (!selection) return undefined

  const wordRegexp = /[0-9a-zA-Z-_@#]/

  const end = Range.end(selection) // end is a point
  let word = ""
  const currentPosition = cloneDeep(end)
  let startOffset = end.offset
  let endOffset = end.offset

  // go left from cursor until it finds the non-word character
  while (
    currentPosition.offset >= 0 &&
    wordRegexp.exec(getLeftChar(editor, currentPosition))
  ) {
    word = getLeftChar(editor, currentPosition) + word
    startOffset = currentPosition.offset - 1
    currentPosition.offset--
  }

  // go right from cursor until it finds the non-word character
  currentPosition.offset = end.offset
  while (
    word.length &&
    wordRegexp.exec(getRightChar(editor, currentPosition))
  ) {
    word += getRightChar(editor, currentPosition)
    endOffset = currentPosition.offset + 1
    currentPosition.offset++
  }

  const range: Range = {
    anchor: {
      path: end.path,
      offset: startOffset,
    },
    focus: {
      path: end.path,
      offset: endOffset,
    },
  }

  return {
    word,
    range,
    type:
      word?.startsWith("#") && flags.channels
        ? ("channel" as const)
        : word?.startsWith("@") && flags.mentions
          ? ("mention" as const)
          : ("text" as const),
  }
}
