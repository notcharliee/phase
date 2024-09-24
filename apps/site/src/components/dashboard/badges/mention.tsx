import { Cross2Icon } from "@radix-ui/react-icons"

import { Badge } from "~/components/ui/badge"

interface Mention {
  name: string
  hexColour?: string
}

interface MentionBadgeProps {
  mention: Mention
  noButton?: boolean
  onButtonClick?: () => void
}

export function MentionBadge({
  mention,
  noButton = false,
  onButtonClick,
}: MentionBadgeProps) {
  const textColour = mention.hexColour ?? "#F8F8F8"
  const backgroundColour = mention.hexColour
    ? mention.hexColour + "40"
    : "#282828"

  return (
    <Badge
      variant="secondary"
      className="bg-[--background-colour] py-px text-xs font-medium text-[--text-colour]"
      style={{
        "--text-colour": textColour,
        "--background-colour": backgroundColour,
      }}
    >
      {!noButton && (
        <div
          role="button"
          aria-label="Remove channel"
          className="hover:text-foreground relative mr-0.5 transition-all before:absolute before:-left-[--padding] before:-top-[--padding] before:h-[calc(100%+var(--padding)*2)] before:w-[calc(100%+var(--padding)*2)] before:rounded-full before:[--padding:1.5px] hover:before:backdrop-brightness-75"
        >
          <Cross2Icon
            role="button"
            className="relative z-10 h-3.5 w-3.5"
            onClick={(e) => {
              e.stopPropagation()
              onButtonClick?.()
            }}
          />
        </div>
      )}
      <span>@{mention.name}</span>
    </Badge>
  )
}
