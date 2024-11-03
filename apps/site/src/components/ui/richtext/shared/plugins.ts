import { Range, Transforms } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"

import type { BaseEditor } from "slate"

export function withPlugins(baseEditor: BaseEditor) {
  const editor = withHistory(withReact(baseEditor))

  const { isInline, isVoid, insertBreak } = editor

  editor.isInline = (el) => el.type !== "text" || isInline(el)
  editor.isVoid = (el) => el.type !== "text" || isVoid(el)

  editor.insertBreak = () => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      return Transforms.insertText(editor, "\n", { at: selection.anchor })
    }

    insertBreak()
  }

  return editor
}
