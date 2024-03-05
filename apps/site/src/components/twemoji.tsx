"use client"

import { memo } from "react"
import twemoji from "twemoji"

export const Twemoji = memo(({ emoji }: { emoji: string }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        attributes() {
          return {
            loading: "lazy",
          }
        },
        folder: "svg",
        ext: ".svg",
      }),
    }}
  />
))

Twemoji.displayName = "Twemoji"
