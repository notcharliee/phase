import { PersonIcon } from "@radix-ui/react-icons"
import { type RESTAPIPartialCurrentUserGuild } from "discord-api-types/v10"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TotalMembersProps<T extends boolean> = T extends true
  ? { fallback: T }
  : { guild: RESTAPIPartialCurrentUserGuild | undefined; fallback?: T }

export const TotalMembers = async <T extends boolean>(
  props: TotalMembersProps<T>,
) => {
  const fallback = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
        <PersonIcon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">Loading...</span>
        <p className="text-muted-foreground text-xs">Loading</p>
      </CardContent>
    </Card>
  )

  if (props.fallback ?? !props.guild) return fallback

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
        <PersonIcon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">
          {props.guild.approximate_member_count?.toString() ?? "Unknown"}
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
