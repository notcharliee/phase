"use client"

import emojiData from "@emoji-mart/data"
import * as emojiMart from "emoji-mart"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/spinner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EmojiPickerProps {
  disabled?: boolean
  fallback?: boolean,
  name?: string
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onValueChange?: (value: string) => void
  ref?: React.Ref<HTMLDivElement>
  value?: string
}

export const EmojiPicker = (props: EmojiPickerProps) => {
  if (props.fallback) return (
    <Button variant="outline" size="icon" disabled={props.disabled}>
      <Spinner className="size-5" />
    </Button>
  )

  const [value, setValue] = useState(props.value ?? "🌙")
  const [searchedEmojis, setSearchedEmojis] = useState<string[]>([])

  emojiMart.init({ data: emojiData })

  const natives: [string, string][] = Object.entries((emojiData as any).natives)
  const categories = (emojiData as any).categories

  const search = async (value: string) => {
    const emojis = value.length ? await emojiMart.SearchIndex.search(value) : []
    const results: string[] = emojis.map((emoji: any) => {
      return emoji.skins[0].native
    })

    setSearchedEmojis(results)
  }

  const updateValue = (value: string) => {
    setValue(value)
    if (props.onValueChange) props.onValueChange(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" disabled={props.disabled}>
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="size-80 space-y-4"
        onBlur={props.onBlur}
        ref={props.ref}
      >
        <Input
          placeholder="Search emojis..."
          onChange={(e) => search(e.target.value)}
        />
        <div className="h-[calc(100%-52px)]">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4">
              {searchedEmojis.length ? (
                <div className="space-y-2">
                  <Label>Search Results</Label>
                  <div className="grid grid-cols-9 text-xl">
                    {searchedEmojis.map((emoji: any) => (
                      <button
                        aria-label={emoji}
                        key={emoji}
                        onClick={(e) => updateValue(e.currentTarget.ariaLabel!)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                categories.map((category: any) => (
                  <div className="space-y-2" key={category.id}>
                    <Label>
                      {category.id.charAt(0).toUpperCase() +
                        category.id.slice(1)}
                    </Label>
                    <div className="grid grid-cols-9 text-xl">
                      {category.emojis.map((emoji: any) => (
                        <button
                          aria-label={
                            natives.find((native) => native[1] === emoji)![0]
                          }
                          key={
                            natives.find((native) => native[1] === emoji)![0]
                          }
                          onClick={(e) =>
                            updateValue(e.currentTarget.ariaLabel!)
                          }
                        >
                          {natives.find((native) => native[1] === emoji)![0]}
                        </button>
                      ))}
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
}
