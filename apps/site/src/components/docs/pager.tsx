"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@repo/ui/button"
import { LucideIcon } from "@repo/ui/lucide-icon"

import { docsPages } from "~/config/nav"

export const Pager = () => {
  const pathname = usePathname()

  const currentPageIndex = docsPages.findIndex((page) => page.href === pathname)

  const prevPage =
    currentPageIndex !== 0
      ? docsPages[currentPageIndex - 1]!
      : { label: "Home", href: "/" }

  const nextPage =
    currentPageIndex !== docsPages.length - 1
      ? docsPages[currentPageIndex + 1]
      : null

  return (
    <div className="flex justify-between">
      <Button variant={"outline"} asChild>
        <Link href={prevPage.href}>
          <LucideIcon name="chevron-left" className="mr-2" />
          {prevPage.label}
        </Link>
      </Button>
      {nextPage && (
        <Button variant={"outline"} asChild>
          <Link href={nextPage.href}>
            {nextPage.label}
            <LucideIcon name="chevron-right" className="ml-2" />
          </Link>
        </Button>
      )}
    </div>
  )
}
