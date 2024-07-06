"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

import { Button } from "~/components/ui/button"

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
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          {prevPage.label}
        </Link>
      </Button>
      {nextPage && (
        <Button variant={"outline"} asChild>
          <Link href={nextPage.href}>
            {nextPage.label}
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}
