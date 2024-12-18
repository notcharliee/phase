"use client"

import * as React from "react"

import { Command as CommandPrimitive } from "cmdk"
import { Editor, Element, Transforms } from "slate"

import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@repo/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { ChannelIcon } from "~/components/channel-icons"

import { useElementSize } from "~/hooks/use-element-size"

import { cn, preventDefault } from "~/lib/utils"

import { BaseRichtext } from "./base"
import { createDeserialiser } from "./shared/deserialisers"
import { useEditor, useGuildData } from "./shared/hooks"
import { createSerialiser } from "./shared/serialisers"
import { createTransformer } from "./shared/transformers"
import { defaultRichTextFlags, getCurrentWord } from "./shared/utils"

import type { BaseRichtextProps } from "./base"

export function RichTextarea({
  flags = defaultRichTextFlags.textarea,
  ref,
  className,
  ...props
}: Omit<BaseRichtextProps, "editor">) {
  const editor = useEditor()
  const editorRef = React.useRef<HTMLDivElement>(null)
  const editorWidth = useElementSize(editorRef)[0]

  React.useImperativeHandle(ref, () => editorRef.current!)

  const guildData = useGuildData(flags)

  const transform = createTransformer(flags, guildData)
  const serialise = createSerialiser(flags)
  const deserialise = createDeserialiser(flags, guildData)

  const [selectOpen, setSelectOpen] = React.useState(false)
  const [selectQuery, setSelectQuery] = React.useState("")

  const currentWord = getCurrentWord(editor, flags)

  // opens the select menu if the current word is not text
  React.useEffect(() => {
    const isNotText = !!(currentWord && currentWord.type !== "text")
    setSelectOpen(isNotText)
    setSelectQuery(isNotText ? currentWord.word.slice(1) : "")
  }, [currentWord])

  // handles selecting an item from the select menu
  const handleItemSelect = React.useCallback(
    (data: Exclude<Element, { type: "text" }>["data"]) => {
      const element: Exclude<Element, { type: "text" }> =
        typeof data.type === "number"
          ? { type: "channel" as const, children: [{ text: "" }], data }
          : { type: "mention" as const, children: [{ text: "" }], data }

      const nodeAfter = Editor.after(editor, currentWord!.range)

      Transforms.insertNodes(editor, element, {
        at: {
          ...currentWord!.range,
          offset: currentWord!.word.length,
        },
      })

      if (!nodeAfter) {
        Transforms.move(editor, { distance: 2, unit: "offset" })
      }
    },
    [editor, currentWord],
  )

  // handles key down events for the editor and select menu
  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!selectOpen) {
        event.stopPropagation()

        if (event.key === "Enter") {
          preventDefault(event)
          editor.insertBreak()
        }
      }

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
            preventDefault(event)

            Transforms.move(editor, {
              distance: 2,
              unit: "offset",
              reverse: direction === -1,
            })
          }
        }
      }
    },
    [editor, selectOpen],
  )

  // closes the select menu on blur
  const onBlur = React.useCallback(() => {
    setSelectOpen(false)
  }, [])

  return (
    <CommandPrimitive loop>
      <Popover open={selectOpen}>
        <PopoverTrigger onClick={preventDefault} asChild>
          <BaseRichtext
            editor={editor}
            ref={editorRef}
            flags={flags}
            transform={transform}
            serialise={serialise}
            deserialise={deserialise}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            className={cn("min-h-20", className)}
            {...props}
          />
        </PopoverTrigger>
        <PopoverContent
          style={{ width: editorWidth + "px" }}
          side="top"
          className="p-0"
          sideOffset={8}
          onOpenAutoFocus={preventDefault}
          onCloseAutoFocus={preventDefault}
        >
          {currentWord && currentWord.type !== "text" && (
            <>
              <CommandPrimitive.Input value={selectQuery} className="hidden" />
              <CommandList className="max-h-[168px]">
                <CommandEmpty>{"No results found :("}</CommandEmpty>
                <CommandGroup>
                  {guildData[`${currentWord.type}s` as const].map((data) => {
                    const isChannel = typeof data.type === "number"
                    const isMention = typeof data.type === "string"
                    const hasColour = "colour" in data

                    return (
                      <CommandItem
                        className="gap-1"
                        key={data.id}
                        value={data.id}
                        keywords={[data.name]}
                        style={{ color: hasColour ? data.colour : undefined }}
                        onSelect={() => handleItemSelect(data)}
                      >
                        {isChannel && <ChannelIcon channelType={data.type} />}
                        {isMention && <span>@</span>}
                        <span>{data.name}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </>
          )}
        </PopoverContent>
      </Popover>
    </CommandPrimitive>
  )
}
