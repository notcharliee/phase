"use client"

import { usePathname } from "next/navigation"
import { Fragment } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/breadcrumb"

import { cn } from "~/lib/utils"

export const Breadcrumbs = () => {
  const pathname = usePathname()

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathname.split("/").map((part, index, parts) => {
          if (part === "") return null

          const partsLength = parts.length
          const href = parts.slice(0, index + 1).join("/")

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={href}
                  className={cn(index + 1 === partsLength && "text-foreground")}
                >
                  {part
                    .replaceAll("-", " ")
                    .replace(/\b\w/g, (match) => match.toUpperCase())}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index + 1 !== partsLength && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
