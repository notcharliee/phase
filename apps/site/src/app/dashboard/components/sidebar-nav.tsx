"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { SidebarNavItem } from "@/types/nav"

import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"

export const SidebarNav = (props: { items: SidebarNavItem[] }) => {
  const pathname = usePathname()

  return (
    <nav className="sticky top-[5.5rem] h-[calc(100vh-7rem-1px)]">
      <ScrollArea className="flex h-full w-full flex-col gap-2 rounded-xl border">
        <div className="border-b p-6">
          <h4 className="text-base font-semibold">Modules</h4>
          <p className="text-muted-foreground text-sm">
            Manage your server's module settings.
          </p>
        </div>
        <div className="flex flex-col gap-2 p-6">
          {props.items
            .filter((item) => !item.disabled && item.href)
            .map((item, index) => (
              <Link
                key={index}
                href={
                  pathname === item.href ? "/dashboard/modules" : item.href!
                }
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "border-muted w-full justify-start border",
                )}
              >
                {item.title}
              </Link>
            ))}
        </div>
      </ScrollArea>
    </nav>
  )
}
