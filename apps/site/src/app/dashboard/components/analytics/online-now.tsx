import { ChatBubbleIcon } from "@radix-ui/react-icons"
import { RESTAPIPartialCurrentUserGuild } from "discord-api-types/v10"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type OnlineNowProps<T extends boolean> = T extends true
  ? { fallback: T }
  : { guild: RESTAPIPartialCurrentUserGuild | undefined; fallback?: T }

export const OnlineNow = async <T extends boolean>(
  props: OnlineNowProps<T>,
) => {
  const fallback = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Online Now</CardTitle>
        <ChatBubbleIcon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">Loading...</span>
        <p className="text-muted-foreground text-xs">Loading</p>
      </CardContent>
    </Card>
  )

  if (props.fallback || !props.guild) return fallback

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Online Now</CardTitle>
        <ChatBubbleIcon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">
          {props.guild.approximate_presence_count?.toString() ?? "Unknown"}
        </span>
        <p className="text-muted-foreground text-xs">
          Last updated:{" "}
          {new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </CardContent>
    </Card>
  )
}
