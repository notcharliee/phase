import NextLink from "next/link"

import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

import type { VariantProps } from "class-variance-authority"
import type { LinkProps as NextLinkProps } from "next/link"

export const linkVariants = cva(
  "font-medium underline-offset-2 transition-colors",
  {
    variants: {
      variant: {
        default: "text-foreground underline",
        hover:
          "text-muted-foreground hover:text-primary aria-selected:text-primary hover:underline",
        "no-underline": "no-underline",
      },
      size: {
        base: "text-base",
        sm: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface LinkProps
  extends NextLinkProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string
  label?: string
  external?: boolean
}

export function Link({
  className,
  variant,
  size,
  label,
  external,
  ...props
}: LinkProps) {
  const Comp = external ? "a" : NextLink

  return (
    <Comp
      title={label}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(linkVariants({ variant, size, className }))}
      {...props}
    />
  )
}
