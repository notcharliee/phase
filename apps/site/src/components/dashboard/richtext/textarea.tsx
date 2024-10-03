"use client"

import * as React from "react"

import { Command as CommandPrimitive } from "cmdk"
import * as Slate from "slate"
import * as SlateHistory from "slate-history"
import * as SlateReact from "slate-react"

import { allowedChannelTypes, ChannelIcon } from "~/components/channel-icons"
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { useDashboardContext } from "~/hooks/use-dashboard-context"
import { useElementSize } from "~/hooks/use-element-size"

import { cn } from "~/lib/utils"

import { decorateEntry } from "./decorations"
import { ElementNode, LeafNode, PlaceholderNode } from "./nodes"
import { deserialise, serialise } from "./serialising"
import { applyTransformations } from "./transformations"
import { getCurrentWord } from "./utils"

import type { GuildElementData } from "~/types/slate"

export interface RichTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string | undefined
  onChange?: (value: string | undefined) => void
}

export const RichTextarea = React.forwardRef<HTMLDivElement, RichTextareaProps>(
  ({ className, value, onChange, onKeyDown, onBlur, ...props }, ref) => {
    const dashboard = useDashboardContext()

    const guildData: GuildElementData = React.useMemo(
      () => ({
        channels: dashboard.guild.channels
          .filter((channel) => allowedChannelTypes.includes(channel.type))
          .map((channel) => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
          })),
        mentions: [
          {
            id: "everyone",
            name: "everyone",
            type: "everyone",
            colour: "#f8f8f8",
          },
          {
            id: "here",
            name: "here",
            type: "here",
            colour: "#f8f8f8",
          },
          ...dashboard.guild.roles
            .filter((role) => role.name !== "@everyone")
            .sort((a, b) => a.position + b.position)
            .map((role) => ({
              id: role.id,
              name: role.name,
              type: "role" as const,
              colour:
                role.color !== 0
                  ? `#${role.color.toString(16).padStart(6, "0")}`
                  : "#f8f8f8",
            })),
        ],
      }),
      [dashboard.guild.channels, dashboard.guild.roles],
    )

    // editor stuff //

    const editor = React.useMemo(
      () => withCustomisations(Slate.createEditor()),
      [],
    )

    const renderElement = React.useCallback(ElementNode, [])
    const renderLeaf = React.useCallback(LeafNode, [])
    const renderPlaceholder = React.useCallback(PlaceholderNode, [])

    const decorate = React.useCallback(decorateEntry, [])

    const editorRef = React.useRef<HTMLDivElement>(null)
    const editorSize = useElementSize(editorRef)

    React.useImperativeHandle(ref, () => editorRef.current!)

    // selection stuff //

    const [selectOpen, setSelectOpen] = React.useState(false)
    const [selectQuery, setSelectQuery] = React.useState("")

    const currentElement = getCurrentWord(editor)
    const currentElementWord = currentElement.currentWord
    const currentElementType = currentElementWord?.startsWith("#")
      ? "channel"
      : currentElementWord?.startsWith("@")
        ? "mention"
        : "text"

    React.useEffect(() => {
      const isNotText = currentElementType !== "text"

      setSelectOpen(isNotText)
      setSelectQuery(isNotText ? currentElementWord!.slice(1) : "")
    }, [currentElementWord, currentElementType])

    const handleItemSelect = (
      data: Exclude<Slate.Element, { type: "text" }>["data"],
    ) => {
      const element: Exclude<Slate.Element, { type: "text" }> =
        typeof data.type === "number"
          ? { type: "channel", children: [{ text: "" }], data }
          : { type: "mention", children: [{ text: "" }], data }

      const nodeAfter = Slate.Editor.after(editor, currentElement.currentRange!)

      Slate.Transforms.insertNodes(editor, element, {
        at: {
          ...currentElement.currentRange!,
          offset: currentElementWord!.length,
        },
      })

      if (!nodeAfter) {
        Slate.Transforms.move(editor, { distance: 2, unit: "offset" })
      }
    }

    // event stuff //

    const preventDefault = React.useCallback(
      (event: Event | React.SyntheticEvent) => {
        event.preventDefault()
      },
      [],
    )

    const onEditorValueChange = React.useCallback(
      (descendants: Slate.Descendant[]) => {
        applyTransformations(editor, guildData)
        if (onChange) {
          const serialisedValue = serialise(descendants)
          onChange(serialisedValue.length ? serialisedValue : undefined)
        }
      },
      [editor, guildData, onChange],
    )

    const onEditorKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (onKeyDown) onKeyDown(event)

        // stops the command component from handling the event
        if (!selectOpen) event.stopPropagation()

        // stops the editor from hard breaking on enter
        if (event.key === "Enter") {
          if (!selectOpen) {
            event.preventDefault()
            editor.insertBreak()
          }
        }

        // makes the editor skip over inline elements on arrow right/left
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          const { selection } = editor

          if (selection) {
            const direction = event.key === "ArrowRight" ? 1 : -1

            const targetPoint = Slate.Editor[
              direction === -1 ? "before" : "after"
            ](editor, selection, {
              distance: 1,
              unit: "character",
            })

            const [targetNode] = targetPoint
              ? Slate.Editor.parent(editor, targetPoint)
              : [undefined, undefined]

            if (
              Slate.Element.isElement(targetNode) &&
              Slate.Editor.isInline(editor, targetNode)
            ) {
              event.preventDefault()

              Slate.Transforms.move(editor, {
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

    const onEditorBlur = React.useCallback(
      (event: React.FocusEvent<HTMLDivElement>) => {
        setSelectOpen(false)
        if (onBlur) onBlur(event)
      },
      [],
    )

    // actual rendering stuff //

    return (
      <SlateReact.Slate
        editor={editor}
        initialValue={deserialise(value ?? "", guildData)}
        onValueChange={onEditorValueChange}
      >
        <CommandPrimitive loop>
          <Popover open={selectOpen}>
            <PopoverTrigger onClick={preventDefault} asChild>
              <SlateReact.Editable
                ref={editorRef}
                readOnly={props.disabled}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                renderPlaceholder={renderPlaceholder}
                decorate={decorate}
                onKeyDown={onEditorKeyDown}
                onBlur={onEditorBlur}
                className={cn(
                  "border-input bg-background focus-visible:ring-ring flex min-h-20 w-full flex-col rounded-md border px-3 py-2 text-sm tracking-tight shadow-sm read-only:cursor-not-allowed read-only:opacity-50 focus-visible:outline-none focus-visible:ring-1",
                  className,
                )}
                {...props}
              />
            </PopoverTrigger>
            <PopoverContent
              style={{ width: editorSize[0] + "px" }}
              className="p-0"
              side="top"
              sideOffset={8}
              onOpenAutoFocus={preventDefault}
              onCloseAutoFocus={preventDefault}
            >
              {selectOpen && (
                <>
                  <CommandPrimitive.Input
                    value={selectQuery}
                    className="hidden"
                  />
                  <CommandList className="max-h-[168px]">
                    <CommandEmpty>No results found :(</CommandEmpty>
                    <CommandGroup>
                      {currentElementType == "channel"
                        ? guildData.channels.map((channel) => (
                            <CommandItem
                              key={channel.id}
                              value={channel.id}
                              keywords={[channel.name]}
                              className="gap-1"
                              onSelect={() => handleItemSelect(channel)}
                            >
                              <ChannelIcon type={channel.type} />
                              <span>{channel.name}</span>
                            </CommandItem>
                          ))
                        : currentElementType === "mention"
                          ? guildData.mentions.map((mention) => (
                              <CommandItem
                                key={mention.id}
                                value={mention.id}
                                keywords={[mention.name]}
                                onSelect={() => handleItemSelect(mention)}
                              >
                                <span style={{ color: mention.colour }}>
                                  @{mention.name}
                                </span>
                              </CommandItem>
                            ))
                          : null}
                    </CommandGroup>
                  </CommandList>
                </>
              )}
            </PopoverContent>
          </Popover>
        </CommandPrimitive>
      </SlateReact.Slate>
    )
  },
)

RichTextarea.displayName = "RichTextarea"

/**
 * Adds custom behaviours to the editor.
 */
function withCustomisations(baseEditor: Slate.BaseEditor) {
  const editor = SlateHistory.withHistory(SlateReact.withReact(baseEditor))

  const { isInline, isVoid, insertBreak } = editor

  editor.isInline = (el) =>
    el.type === "channel" || el.type === "mention" ? true : isInline(el)

  editor.isVoid = (el) =>
    el.type === "channel" || el.type === "mention" ? true : isVoid(el)

  editor.insertBreak = () => {
    const { selection } = editor

    if (selection && Slate.Range.isCollapsed(selection)) {
      return Slate.Transforms.insertText(editor, "\n", { at: selection.anchor })
    }

    insertBreak()
  }

  return editor
}
