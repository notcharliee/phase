/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import * as emojiMart from "emoji-mart"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/spinner"
import { Twemoji } from "@/components/twemoji"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EmojiPickerProps {
  emojis: any
  disabled?: boolean
  fallback?: boolean
  name?: string
  onBlur?: React.FocusEventHandler<any>
  onChange?: (value: string) => void
  ref?: React.Ref<any>
  value?: string
}

export const EmojiPicker = (props: EmojiPickerProps) => {
  const [value, setValue] = useState(props.value ?? "🌙")
  const [searchedEmojis, setSearchedEmojis] = useState<string[]>([])

  const [open, setOpen] = useState(false)

  if (props.fallback)
    return (
      <Button variant="outline" size="icon" disabled={props.disabled}>
        <Spinner className="size-5" />
      </Button>
    )

  void emojiMart.init({ data: props.emojis })

  const natives: [string, string][] = Object.entries(props.emojis.natives)
  const categories = props.emojis.categories

  const search = async (value: string) => {
    const emojis: any[] = value.length
      ? await emojiMart.SearchIndex.search(value)
      : []
    const results: string[] = emojis.map((emoji: any) => {
      return emoji.skins[0].native
    })

    setSearchedEmojis(results)
  }

  const updateValue = (value: string) => {
    if (props.onChange) props.onChange(value)
    setValue(value)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={props.disabled}
          onBlur={props.onBlur}
          ref={props.ref}
        >
          <Twemoji emoji={value} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="size-80 space-y-4">
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
                        <Twemoji emoji={emoji} />
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
                          <Twemoji
                            emoji={
                              natives.find((native) => native[1] === emoji)![0]
                            }
                          />
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
