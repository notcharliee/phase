import { cloneElement } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const AnalyticsCard = (props: {
  title: string
  icon: JSX.Element
  primaryText: React.ReactNode | undefined
  secondaryText: React.ReactNode | undefined
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
        {cloneElement(props.icon, {
          className: "text-muted-foreground h-4 w-4",
        })}
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">
          {props.primaryText ?? "Unknown"}
        </span>
        <p className="text-muted-foreground text-xs">
          {props.secondaryText ?? "Unknown"}
        </p>
      </CardContent>
    </Card>
  )
}
