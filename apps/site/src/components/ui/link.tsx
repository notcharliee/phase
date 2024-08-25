import NextLink from "next/link"
import { forwardRef } from "react"

import { cn } from "~/lib/utils"

import type { LinkProps as NextLinkProps } from "next/link"

interface LinkProps
  extends NextLinkProps,
    React.HTMLAttributes<HTMLAnchorElement> {}

export const Link = forwardRef<React.ElementRef<typeof NextLink>, LinkProps>(
  ({ className, ...props }, ref) => (
    <NextLink
      ref={ref}
      className={cn(
        "text-foreground font-medium underline underline-offset-2",
        className,
      )}
      {...props}
    />
  ),
)
