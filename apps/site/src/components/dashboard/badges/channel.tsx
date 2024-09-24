import { Cross2Icon } from "@radix-ui/react-icons"

import { ChannelIcon } from "~/components/channel-icons"
import { Badge } from "~/components/ui/badge"

import type {
  APIGuildChannel,
  GuildChannelType,
} from "@discordjs/core/http-only"

interface ChannelBadgeProps {
  channel: APIGuildChannel<GuildChannelType>
  noButton?: boolean
  onButtonClick?: () => void
}

export function ChannelBadge({
  channel,
  noButton = false,
  onButtonClick,
}: ChannelBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1 py-px text-xs font-medium">
      {!noButton && (
        <div
          role="button"
          aria-label="Remove channel"
          className="text-muted-foreground hover:text-foreground relative mr-0.5 transition-all before:absolute before:-left-[--padding] before:-top-[--padding] before:h-[calc(100%+var(--padding)*2)] before:w-[calc(100%+var(--padding)*2)] before:rounded-full before:[--padding:1.5px] hover:before:backdrop-brightness-75"
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
      <ChannelIcon type={channel.type} />
      <span>{channel.name}</span>
    </Badge>
  )
}
