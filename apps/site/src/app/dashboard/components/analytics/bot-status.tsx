import Link from "next/link"

import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  OpenInNewWindowIcon,
  UpdateIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  GET as getBotStatus,
  type GetBotStatusResponse,
} from "@/app/api/bot/status/route"

export const BotStatus = async (props: { fallback?: boolean }) => {
  if (props.fallback)
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
          <UpdateIcon className="text-muted-foreground h-4 w-4 animate-spin" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">Loading...</span>
          <Link
            className="flex items-center underline-offset-2 hover:animate-pulse hover:underline"
            href={"/redirect/discord"}
          >
            <p className="text-muted-foreground text-xs">
              Join our Discord for alerts
            </p>
            <OpenInNewWindowIcon className="text-muted-foreground ml-1 h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
    )

  const status = await (await getBotStatus())
    .json()
    .then((json) => json as GetBotStatusResponse)

  const statusText =
    status === "OK"
      ? "No Issues"
      : status === "ISSUES"
        ? "Issues Detected"
        : status === "DOWN"
          ? "Offline"
          : "Unknown"

  const statusIcon =
    status === "OK" ? (
      <CheckCircledIcon className="text-muted-foreground h-4 w-4" />
    ) : status === "ISSUES" ? (
      <ExclamationTriangleIcon className="text-muted-foreground h-4 w-4" />
    ) : status === "DOWN" ? (
      <CrossCircledIcon className="text-muted-foreground h-4 w-4" />
    ) : (
      <QuestionMarkCircledIcon className="text-muted-foreground h-4 w-4" />
    )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
        {statusIcon}
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">{statusText}</span>
        <Link
          className="flex items-center underline-offset-2 hover:animate-pulse hover:underline"
          href={"/redirect/discord"}
        >
          <p className="text-muted-foreground text-xs">
            {status === "OK"
              ? "Join our Discord for alerts"
              : "Check our Discord for details"}
          </p>
          <OpenInNewWindowIcon className="text-muted-foreground ml-1 h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  )
}
