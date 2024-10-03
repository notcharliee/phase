import cloneDeep from "lodash.clonedeep"
import { Editor, Range } from "slate"

import type { BasePoint } from "slate"
import type { ReactEditor } from "slate-react"

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
  editor: ReactEditor,
): {
  currentWord?: string
  currentRange?: Range
} => {
  const { selection } = editor

  const wordRegexp = /[0-9a-zA-Z-_@#]/

  if (selection) {
    const end = Range.end(selection) // end is a Point
    let currentWord = ""
    const currentPosition = cloneDeep(end)
    let startOffset = end.offset
    let endOffset = end.offset

    // go left from cursor until it finds the non-word character
    while (
      currentPosition.offset >= 0 &&
      wordRegexp.exec(getLeftChar(editor, currentPosition))
    ) {
      currentWord = getLeftChar(editor, currentPosition) + currentWord
      startOffset = currentPosition.offset - 1
      currentPosition.offset--
    }

    // go right from cursor until it finds the non-word character
    currentPosition.offset = end.offset
    while (
      currentWord.length &&
      wordRegexp.exec(getRightChar(editor, currentPosition))
    ) {
      currentWord += getRightChar(editor, currentPosition)
      endOffset = currentPosition.offset + 1
      currentPosition.offset++
    }

    const currentRange: Range = {
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
      currentWord,
      currentRange,
    }
  }

  return {}
}
