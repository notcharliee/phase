import { LucideIcon } from "~/components/icons/lucide"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { Link } from "~/components/ui/link"

export interface UserHoverCardProps {
  username: string
  avatar: string
  bio: string
  joined: string
  url: string
}

export const UserHoverCard = (props: UserHoverCardProps) => (
  <HoverCard openDelay={0} closeDelay={300}>
    <HoverCardTrigger asChild>
      <Link href={props.url}>{props.username}</Link>
    </HoverCardTrigger>
    <HoverCardContent>
      <div className="flex justify-between space-x-4">
        <Avatar>
          <AvatarImage src={props.avatar} />
          <AvatarFallback />
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{props.username}</h4>
          <p className="text-sm">{props.bio}</p>
          <div className="flex items-center pt-2">
            <LucideIcon name="calendar" className="mr-2 opacity-70" />{" "}
            <span className="text-muted-foreground text-xs">
              Joined {props.joined}
            </span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
)
