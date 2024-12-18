"use client"

import * as React from "react"

import { Editor, Node, Text, Transforms } from "slate"
import { Editable, Slate } from "slate-react"

import { decorateEntry } from "~/components/richtext/shared/decorators"
import { ElementNode } from "~/components/richtext/shared/nodes/element"
import { LeafNode } from "~/components/richtext/shared/nodes/leaf"
import { PlaceholderNode } from "~/components/richtext/shared/nodes/placeholder"
import { isRootElement } from "~/components/richtext/shared/utils"

import { cn } from "~/lib/utils"

import type {
  RichTextDeserialiser,
  RichTextEditor,
  RichTextFlags,
  RichTextSerialiser,
  RichTextTransform,
} from "~/components/richtext/shared/types"
import type { Descendant, NodeEntry, Path } from "slate"

export interface BaseRichtextProps
  extends Omit<React.TextareaHTMLAttributes<HTMLDivElement>, "onChange"> {
  editor: RichTextEditor
  ref?: React.Ref<HTMLDivElement>
  value?: string | undefined
  flags?: RichTextFlags
  transform?: RichTextTransform
  serialise?: RichTextSerialiser
  deserialise?: RichTextDeserialiser
  onChange?: (value: string | undefined) => void
}

export function BaseRichtext({
  editor,
  value,
  className,
  flags = {},
  serialise,
  deserialise,
  transform,
  onChange,
  onKeyDown,
  ...props
}: BaseRichtextProps) {
  // defines the rendering functions for the editor
  const renderElement = React.useCallback(ElementNode, [])
  const renderPlaceholder = React.useCallback(PlaceholderNode, [])
  const renderLeaf = React.useCallback(LeafNode, [])

  // defines the decorations for the editor
  const decorate = React.useCallback(
    (entry: NodeEntry) => {
      if (!flags.decorations) return []
      return decorateEntry(entry)
    },
    [flags.decorations],
  )

  // converts a slate value to a string
  const serialiseValue = React.useCallback<RichTextSerialiser>(
    (value) => {
      if (serialise) return serialise(value)
      return value.map((node) => ("text" in node ? node.text : "")).join("")
    },
    [serialise],
  )

  // converts a string to a slate value
  const deserialiseValue = React.useCallback<RichTextDeserialiser>(
    (value) => {
      if (deserialise) return deserialise(value)
      return [{ type: "text", children: [{ text: value }] }]
    },
    [deserialise],
  )

  // updates the editor value
  const onEditorValueChange = React.useCallback(
    (newValue: Descendant[]) => {
      const rootElement = newValue[0]

      if (!isRootElement(rootElement)) {
        throw new Error("Descendant is not a root element")
      }

      if (transform) {
        const traverse = (path: Path) => {
          const node = Node.get(editor, path)

          // if the node is not a text node, traverse its children
          if (!Text.isText(node)) {
            Node.children(editor, path).forEach(([, p]) => traverse(p))
            return
          }

          // if the node is a text node, transform it
          for (const { element, range, offset } of transform(path, node)) {
            const deleteOptions = { at: { ...range } }
            const insertOptions = { at: { path, offset } }

            Transforms.delete(editor, deleteOptions)
            Transforms.insertNodes(editor, element, insertOptions)

            const nodeAfter = Editor.after(editor, range)
            if (nodeAfter) return

            Transforms.move(editor, { distance: 2, unit: "offset" })
          }
        }

        traverse([])
      }

      if (onChange) {
        const value = serialiseValue([rootElement])
        onChange(value.length ? value : undefined)
      }
    },
    [editor, transform, onChange, serialiseValue],
  )

  // handles editor key down events
  const onEditorKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDown) onKeyDown(event)
      else if (event.key === "Enter") {
        event.preventDefault()
        editor.insertBreak()
      }
    },
    [onKeyDown, editor],
  )

  return (
    <Slate
      editor={editor}
      initialValue={deserialiseValue(value ?? "")}
      onValueChange={onEditorValueChange}
    >
      <Editable
        readOnly={props.disabled}
        decorate={decorate}
        renderElement={renderElement}
        renderPlaceholder={renderPlaceholder}
        renderLeaf={renderLeaf}
        onKeyDown={onEditorKeyDown}
        className={cn(
          "border-input bg-background focus-visible:ring-ring flex w-full flex-col rounded-md border px-3 py-2 text-sm tracking-tight shadow-sm read-only:cursor-not-allowed read-only:opacity-50 focus-visible:outline-none focus-visible:ring-1",
          className,
        )}
        {...props}
      />
    </Slate>
  )
}
