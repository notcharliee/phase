import Link from "next/link"
import * as React from "react"

import { LucideIcon } from "@repo/ui/lucide-icon"
import { Slot } from "@repo/ui/slot"

import { cn } from "~/lib/utils"

export interface BreadcrumbProps extends React.ComponentPropsWithRef<"nav"> {
  separator?: React.ReactNode
}

export function Breadcrumb(props: BreadcrumbProps) {
  return <nav aria-label="breadcrumb" {...props} />
}

export interface BreadcrumbListProps
  extends React.ComponentPropsWithRef<"ol"> {}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5",
        className,
      )}
      {...props}
    />
  )
}

export interface BreadcrumbItemProps
  extends React.ComponentPropsWithRef<"li"> {}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithRef<typeof Link> {
  asChild?: boolean
}

export function BreadcrumbLink({
  asChild,
  className,
  ...props
}: BreadcrumbLinkProps) {
  const Comp = asChild ? (Slot as unknown as typeof Link) : Link

  return (
    <Comp
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

export interface BreadcrumbPageProps
  extends React.ComponentPropsWithRef<"span"> {}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

export interface BreadcrumbSeparatorProps
  extends React.ComponentPropsWithRef<"li"> {
  children?: React.ReactNode
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <LucideIcon name="chevron-right" />}
    </li>
  )
}

export interface BreadcrumbEllipsisProps
  extends React.ComponentPropsWithRef<"span"> {}

export function BreadcrumbEllipsis({
  className,
  ...props
}: BreadcrumbEllipsisProps) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <LucideIcon name="ellipsis" />
      <span className="sr-only">More</span>
    </span>
  )
}
