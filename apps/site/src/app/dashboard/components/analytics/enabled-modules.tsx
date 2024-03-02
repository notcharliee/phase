import { LightningBoltIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons"
import { Guild } from "@repo/schemas"
import { Document, Types } from "mongoose"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { modulesConfig } from "@/config/modules"
import Link from "next/link"

type DatabaseGuild = Document<unknown, {}, Guild> &
  Guild & {
    _id: Types.ObjectId
  }

type EnabledModulesProps<T extends boolean> = T extends true
  ? { fallback: T }
  : {
      guild: DatabaseGuild | undefined
      fallback?: T
    }

export const EnabledModules = async <T extends boolean>(
  props: EnabledModulesProps<T>,
) => {
  const fallback = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Enabled Modules</CardTitle>
        <LightningBoltIcon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">Loading...</span>
        <Link
          className="flex items-center underline-offset-2 hover:animate-pulse hover:underline"
          href={"/dashboard/modules"}
        >
          <p className="text-muted-foreground text-xs">Module settings</p>
          <OpenInNewWindowIcon className="text-muted-foreground ml-1 h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  )

  if (props.fallback || !props.guild) return fallback

  const enabledModules = `${Object.values(props.guild.modules ?? {}).filter((module) => module.enabled).length} / ${modulesConfig.length}`

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Enabled Modules</CardTitle>
        <LightningBoltIcon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">
          {enabledModules ?? "Unknown"}
        </span>
        <Link
          className="flex items-center underline-offset-2 hover:animate-pulse hover:underline"
          href={"/dashboard/modules"}
        >
          <p className="text-muted-foreground text-xs">Module settings</p>
          <OpenInNewWindowIcon className="text-muted-foreground ml-1 h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  )
}
