"use client"

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"

import { createEditor, Editor, Element, Range, Transforms } from "slate"
import { withHistory } from "slate-history"
import { Editable, Slate, withReact } from "slate-react"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { cn } from "~/lib/utils"

import { decorateEntry } from "./decorations"
import {
  allowedChannelTypes,
  CustomElementNode,
  CustomLeafNode,
  CustomPlaceholderNode,
} from "./nodes"
import { SelectElement } from "./select"
import { deserialise, serialise } from "./serialising"
import { applyTransformations } from "./transformations"

import type { AllowedChannelType, CustomElement, CustomLeaf } from "./nodes"
import type {
  APIGuildChannel,
  APIRole,
  ChannelType,
} from "discord-api-types/v10"
import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"

declare module "slate" {
  interface CustomTypes {
    Element: CustomElement
    Text: CustomLeaf
  }
}

export interface GuildData {
  channels: APIGuildChannel<AllowedChannelType>[]
  roles: APIRole[]
}

export interface RichTextareaProps {
  value?: string
  placeholder?: string
  disabled?: boolean
  name?: string
  className?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export const RichTextarea = forwardRef<
  React.ElementRef<typeof Editable>,
  RichTextareaProps
>((props, ref) => {
  const dashboardData = useDashboardContext(true)

  const guildData: GuildData = dashboardData
    ? {
        channels: dashboardData.guild.channels.filter((channel) =>
          (allowedChannelTypes as readonly ChannelType[]).includes(
            channel.type,
          ),
        ) as GuildData["channels"],
        roles: dashboardData.guild.roles.filter(
          (role) => role.name !== "@everyone",
        ),
      }
    : {
        channels: [],
        roles: [],
      }

  const editor = useMemo(
    () => withCustomisations(withHistory(withReact(createEditor()))),
    [],
  )

  const renderElement = useCallback(CustomElementNode, [])
  const renderLeaf = useCallback(CustomLeafNode, [])
  const renderPlaceholder = useCallback(CustomPlaceholderNode, [])

  const decorate = useCallback(decorateEntry, [])

  const internalRef = useRef<HTMLDivElement>(null)
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
    ref,
    () => internalRef.current,
  )

  const [selectOpen, setSelectOpen] = useState(false)

  const onKeyDown = (event: React.KeyboardEvent) => {
    // prevents the editor from not soft breaking on shift+enter
    if (event.key === "Enter") {
      event.preventDefault()
      if (!selectOpen) editor.insertBreak()
    }

    // makes the editor skip over inline elements on arrow right/left
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const { selection } = editor

      if (selection) {
        const direction = event.key === "ArrowRight" ? 1 : -1

        const targetPoint = Editor[direction === -1 ? "before" : "after"](
          editor,
          selection,
          {
            distance: 1,
            unit: "character",
          },
        )

        const [targetNode] = targetPoint
          ? Editor.parent(editor, targetPoint)
          : [undefined, undefined]

        if (
          Element.isElement(targetNode) &&
          Editor.isInline(editor, targetNode)
        ) {
          event.preventDefault()

          Transforms.move(editor, {
            distance: 2,
            unit: "offset",
            reverse: direction === -1,
          })
        }
      }
    }
  }

  return (
    <Slate
      editor={editor}
      initialValue={deserialise(props.value ?? "", guildData)}
      onValueChange={(descendants) => {
        applyTransformations(editor, guildData)
        props.onChange?.(serialise(descendants))
      }}
    >
      <div className="relative w-full">
        <SelectElement
          guildData={guildData}
          editableRef={internalRef}
          onOpenChange={setSelectOpen}
        />
        <Editable
          ref={internalRef}
          name={props.name}
          readOnly={props.disabled}
          placeholder={props.placeholder}
          onBlur={props.onBlur}
          renderPlaceholder={renderPlaceholder}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          decorate={decorate}
          onKeyDown={onKeyDown}
          className={cn(
            "border-input bg-background focus-visible:ring-ring flex min-h-20 w-full flex-col rounded-md border px-3 py-2 text-sm tracking-tight shadow-sm read-only:cursor-not-allowed read-only:opacity-50 focus-visible:outline-none focus-visible:ring-1",
            props.className,
          )}
        />
      </div>
    </Slate>
  )
})

/**
 * Adds custom behaviours to the editor.
 */
function withCustomisations<T extends BaseEditor & ReactEditor>(editor: T) {
  const { isInline, isVoid, insertBreak } = editor

  editor.isInline = (el) =>
    el.type === "channel" || el.type === "mention" ? true : isInline(el)

  editor.isVoid = (el) =>
    el.type === "channel" || el.type === "mention" ? true : isVoid(el)

  editor.insertBreak = () => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      return Transforms.insertText(editor, "\n", { at: selection.anchor })
    }

    insertBreak()
  }

  return editor
}
