"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ScrollArea } from "~/components/ui/scroll-area"

import { docsPages, splitPagesByCategory } from "~/config/nav"

import { cn } from "~/lib/utils"

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <ScrollArea className="flex h-full w-full flex-col gap-4">
      {Object.entries(splitPagesByCategory(docsPages)).map(
        ([category, pages]) => (
          <div key={category} className="mb-4">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
              {category}
            </h4>
            {pages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={cn(
                  "text-muted-foreground group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-sm hover:underline",
                  pathname === page.href &&
                    "text-foreground font-medium underline",
                )}
                target={page.external ? "_blank" : ""}
                rel={page.external ? "noreferrer" : ""}
              >
                {page.label}
              </Link>
            ))}
          </div>
        ),
      )}
    </ScrollArea>
  )
}
