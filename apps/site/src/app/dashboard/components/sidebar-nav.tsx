"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { SidebarNavItem } from "@/types/nav"

import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { cn } from "@/lib/utils"


export const SidebarNav = (props: { items: SidebarNavItem[] }) => {
  const pathname = usePathname()

  return (
    <nav className="sticky top-[5.5rem] h-[calc(100vh-7rem-1px)]">
      <ScrollArea className="h-full w-full rounded-md border flex flex-col gap-2">
        <div className="p-4">
          <h4 className="font-semibold text-base">Modules</h4>
          <p className="text-muted-foreground text-sm">Manage your server's module settings.</p>
        </div>
        <Separator />
        <div className="p-4 flex flex-col gap-2">
          {props.items.map((item, index) =>
            item.href && !item.disabled ? (
              <Link
                key={index}
                href={pathname === item.href ? "/dashboard/modules" : item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start w-full border border-muted"
                )}
              >
                {item.title}
              </Link>
            ) : (
              <span
                key={index}
                className={cn(
                  "flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline",
                  buttonVariants({ variant: "ghost" }),
                  item.disabled && "cursor-not-allowed opacity-60",
                )}
              >
                {item.title}
                {item.label && (
                  <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline">
                    {item.label}
                  </span>
                )}
              </span>
            )
          )}
        </div>
      </ScrollArea>
    </nav>
  )
}