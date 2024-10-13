"use client"

import { forwardRef, useCallback, useEffect, useMemo, useState } from "react"

import emojiData from "@emoji-mart/data/sets/15/twitter.json"
import { useDebounce } from "@uidotdev/usehooks"
import * as emojiMart from "emoji-mart"

import { Spinner } from "~/components/spinner"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { ScrollArea } from "~/components/ui/scroll-area"

import { cn } from "~/lib/utils"

import type { Emoji as EmojiMartEmoji, Skin } from "@emoji-mart/data"

interface Emoji {
  id: string
  name: string
  skin: Skin
}

interface EmojiPickerProps {
  size?: "default" | "fill"
  disabled?: boolean
  name?: string
  value?: string
  ref?: React.Ref<HTMLButtonElement>
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  onChange?: (value: string) => void
}

export const EmojiPicker = forwardRef<
  React.ElementRef<typeof Button>,
  React.PropsWithoutRef<EmojiPickerProps>
>(({ onChange, value, ...props }: EmojiPickerProps, ref) => {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const [searchResults, setSearchResults] = useState<Emoji[]>([])

  const emojis = useMemo(() => {
    void emojiMart.init({ data: emojiData }).then(() => setLoaded(true))
    return Object.entries(emojiData.emojis).reduce(
      (acc, [id, emoji]) => ({
        ...acc,
        [id]: { id, name: emoji.name, skin: emoji.skins[0]! },
      }),
      {} as { [K in keyof typeof emojiData.emojis]: Emoji },
    )
  }, [])

  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>(
    value
      ? (Object.values(emojis).find((emoji) => emoji.skin.native === value) ??
          emojis.waxing_crescent_moon)
      : emojis.waxing_crescent_moon,
  )

  const searchEmojis = useCallback(async (query: string) => {
    const queryResults = query.length
      ? ((await emojiMart.SearchIndex.search(query)) as EmojiMartEmoji[])
      : []

    const newSearchResults = queryResults.map((emoji) => {
      const { id, name, skins } = emoji
      return { id, name, skin: skins[0]! }
    })
    setSearchResults(newSearchResults)
  }, [])

  useEffect(() => {
    void searchEmojis(debouncedSearchTerm)
  }, [searchEmojis, debouncedSearchTerm])

  const updateValue = (emoji: Emoji) => {
    onChange?.(emoji.skin.native)
    setSelectedEmoji(emoji)
    setOpen(false)
  }

  if (!loaded) {
    return (
      <Button
        variant="outline"
        size={props.size === "fill" ? "default" : "icon"}
        className={cn("gap-2", props.size === "fill" && "w-full")}
        disabled={props.disabled}
      >
        <Spinner className="size-5" />
        {props.size === "fill" && <span>Loading ...</span>}
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant="outline"
          size={props.size === "fill" ? "default" : "icon"}
          className={cn("gap-2.5 justify-start", props.size === "fill" && "w-full")}
          ref={ref}
        >
          <Emoji
            className="size-5"
            name={selectedEmoji.name}
            skin={selectedEmoji.skin}
            isPlaceholder={onChange && !value}
          />
          {props.size === "fill" &&
            (onChange && !value ? (
              <span>Pick an emoji</span>
            ) : (
              <span>:{selectedEmoji.id}:</span>
            ))}
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8} className="size-80 space-y-4">
        <Input
          placeholder="Search emojis..."
          onChange={(value) => setSearchTerm(value ?? "")}
        />
        <div className="h-[calc(100%-52px)]">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4">
              {searchTerm.length && searchTerm === debouncedSearchTerm ? (
                <div className="space-y-2">
                  <Label>Search Results</Label>
                  {searchResults.length ? (
                    <div className="grid grid-cols-9">
                      {searchResults.map((emoji) => (
                        <button
                          key={emoji.id}
                          aria-label={emoji.name}
                          onClick={() => updateValue(emoji)}
                        >
                          <Emoji name={emoji.name} skin={emoji.skin} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No results found.
                    </div>
                  )}
                </div>
              ) : (
                emojiData.categories.map((category) => (
                  <div className="space-y-2" key={category.id}>
                    <Label className="capitalize">{category.id}</Label>
                    <div className="grid grid-cols-9 text-xl">
                      {(category.emojis as (keyof typeof emojis)[]).map(
                        (emojiId) => {
                          const emoji = emojis[emojiId]
                          const { id, name, skin } = emoji

                          return (
                            <button
                              key={id}
                              aria-label={name}
                              onClick={() => updateValue(emoji)}
                            >
                              <Emoji name={name} skin={skin} />
                            </button>
                          )
                        },
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
})

interface EmojiProps {
  name: string
  skin: Skin
  className?: string
  isPlaceholder?: boolean
}

function Emoji({ name, skin, className, isPlaceholder }: EmojiProps) {
  return (
    <div
      title={name}
      aria-label={name}
      className={cn(
        "hover:bg-accent grid aspect-square place-items-center rounded-sm",
        className,
      )}
    >
      <span
        className={cn("block size-3/4", isPlaceholder && "opacity-50")}
        style={{
          backgroundImage: `url("https://cdn.jsdelivr.net/npm/emoji-datasource-twitter@15.0.0/img/twitter/sheets-256/64.png")`,
          backgroundSize: `${100 * emojiData.sheet.cols}% ${100 * emojiData.sheet.rows}%`,
          backgroundPosition: `${(100 / (emojiData.sheet.cols - 1)) * skin.x!}% ${(100 / (emojiData.sheet.rows - 1)) * skin.y!}%`,
        }}
      />
    </div>
  )
}
