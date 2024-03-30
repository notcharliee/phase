import { memo, useMemo } from "react"
import twemoji from "twemoji"

export const Twemoji = memo(({ emoji }: { emoji: string }) => {
  const parsedEmoji = useMemo(() => {
    return twemoji.parse(emoji, {
      attributes() {
        return {
          loading: "lazy",
        }
      },
      folder: "svg",
      ext: ".svg",
      base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"
    })
  }, [emoji])

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: parsedEmoji,
      }}
    />
  )
})

Twemoji.displayName = "Twemoji"
