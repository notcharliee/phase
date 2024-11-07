"use client"

import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "~/lib/utils"

export interface SeparatorProps
  extends React.ComponentPropsWithRef<typeof SeparatorPrimitive.Root> {}

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  )
}
