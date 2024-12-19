"use client"

import NextLink from "next/link"

import { BaseLink, baseLinkVariants } from "@repo/ui/base-link"

import type { BaseLinkProps } from "@repo/ui/base-link"

export const linkVariants = baseLinkVariants

export interface LinkProps extends BaseLinkProps {}

export function Link({ children, href, ...props }: LinkProps) {
  return (
    <BaseLink href={href} {...props}>
      <NextLink href={href}>{children}</NextLink>
    </BaseLink>
  )
}
