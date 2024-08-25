"use client"

import "./index"

import { useCallback, useEffect, useState } from "react"

import { Editor, Transforms } from "slate"
import { useSlate } from "slate-react"

import { useElementSize } from "~/hooks/use-element-size"

import { cn } from "~/lib/utils"

import { ChannelIcon } from "../../channel-icons"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { getCurrentWord } from "./utils"

import type { GuildData } from "."
import type {
  AllowedChannelType,
  ChannelElement,
  MentionElement,
} from "./nodes"
import type { ReactEditor } from "slate-react"

interface SelectElementProps {
  editableRef: React.RefObject<HTMLDivElement>
  guildData: GuildData
  onOpenChange: (open: boolean) => void
}

export const SelectElement = function ({
  editableRef,
  guildData,
  onOpenChange,
}: SelectElementProps) {
  const editor = useSlate() as ReactEditor

  const current = getCurrentWord(editor)

  const currentWordType = current.currentWord?.startsWith("#")
    ? "channel"
    : current.currentWord?.startsWith("@")
      ? "mention"
      : "text"

  const content =
    current?.currentWord && currentWordType !== "text"
      ? searchData(guildData, currentWordType, current.currentWord)
      : undefined

  const [open, setActualOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [editableWidth] = useElementSize(editableRef)

  const setOpen = useCallback(
    (open: boolean) => {
      setActualOpen(open)
      setTimeout(() => onOpenChange(open), 100)
    },
    [onOpenChange],
  )

  const onPopoverItemSelect = useCallback(
    (item?: Channel | Mention) => {
      if (!content || content.length === 0) return

      const data = item ?? content[selectedIndex]
      if (!data) return

      const element = {
        type: currentWordType === "channel" ? "channel" : "mention",
        children: [{ text: "" }],
        data,
      } as ChannelElement | MentionElement

      const nodeAfter = Editor.after(editor, current.currentRange!)

      Transforms.insertNodes(editor, element, {
        at: {
          ...current.currentRange!,
          offset: current.currentWord!.length,
        },
      })

      if (!nodeAfter) {
        Transforms.move(editor, { distance: 2, unit: "offset" })
      }

      setOpen(false)
    },
    [content, current, currentWordType, editor, selectedIndex, setOpen],
  )

  useEffect(() => {
    setOpen(!!content?.length && currentWordType !== "text")

    if (!open || !editableRef.current) return

    const editableElement = editableRef.current

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault()
        onPopoverItemSelect()
      } else if (event.key === "ArrowDown") {
        event.preventDefault()
        setSelectedIndex(
          (prevIndex) => (prevIndex + 1) % (content?.length ?? 1),
        )
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        setSelectedIndex(
          (prevIndex) =>
            (prevIndex + (content?.length ?? 1) - 1) % (content?.length ?? 1),
        )
      }
    }

    editableElement.addEventListener("keydown", handleKeyDown)

    return () => {
      editableElement.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    editableRef,
    currentWordType,
    content,
    open,
    selectedIndex,
    onPopoverItemSelect,
    setOpen,
  ])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="absolute inset-0 h-full w-full" />
      <PopoverContent
        style={{ width: editableWidth + "px" }}
        className="p-1"
        side="top"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onFocus={(e) => {
          e.preventDefault()
          editableRef.current?.focus()
        }}
      >
        {currentWordType !== "text" &&
          content?.map((item, index) => {
            const isSelected = index === selectedIndex

            return (
              <button
                key={item.id}
                onClick={() => onPopoverItemSelect(item)}
                style={"colour" in item ? { color: item.colour } : undefined}
                className={cn(
                  "text-muted-foreground relative flex w-full cursor-default select-none items-center gap-1 rounded-sm py-1.5 pl-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  isSelected && "bg-accent text-accent-foreground",
                )}
              >
                {currentWordType === "channel" && (
                  <ChannelIcon type={item.type as AllowedChannelType} />
                )}
                {currentWordType === "mention" ? `@${item.name}` : item.name}
              </button>
            )
          })}
      </PopoverContent>
    </Popover>
  )
}

type Channel = ChannelElement["data"]
type Mention = MentionElement["data"]

type SearchResults<T extends "channel" | "mention"> = T extends "channel"
  ? Channel[]
  : Mention[]

function searchData<T extends "channel" | "mention">(
  data: GuildData,
  type: T,
  query: string,
): SearchResults<T> {
  const queryLower = query.replace("#", "").replace("@", "").toLowerCase()
  const results = []

  if (type === "channel") {
    for (const channel of data.channels) {
      if (channel.name.toLowerCase().includes(queryLower)) {
        results.push({
          id: channel.id,
          name: channel.name,
          type: channel.type,
        })
      }
    }
  } else if (type === "mention") {
    for (const role of data.roles) {
      if (role.name.toLowerCase().includes(queryLower)) {
        results.push({
          id: role.id,
          name: role.name,
          colour: role.color ? `#${role.color.toString(16)}` : "#f8f8f8",
          type: "role",
        })
      }
    }

    if ("everyone".includes(queryLower)) {
      results.push({
        id: "everyone",
        name: "everyone",
        colour: "#f8f8f8",
        type: "everyone",
      })
    }

    if ("here".includes(queryLower)) {
      results.push({
        id: "here",
        name: "here",
        colour: "#f8f8f8",
        type: "here",
      })
    }
  }

  return results
    .sort((a, b) => {
      return (
        getLevenshteinDistance(a.name.toLowerCase(), queryLower) -
        getLevenshteinDistance(b.name.toLowerCase(), queryLower)
      )
    })
    .slice(0, 5) as SearchResults<T>
}

function getLevenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) matrix[0]![j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j - 1]! + 1,
        )
      }
    }
  }

  return matrix[a.length]![b.length]!
}
