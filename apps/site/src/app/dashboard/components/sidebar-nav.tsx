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
          {props.items.filter(item => !item.disabled && item.href).map((item, index) =>
            <Link
              key={index}
              href={pathname === item.href ? "/dashboard/modules" : item.href!}
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
          )}
        </div>
      </ScrollArea>
    </nav>
  )
}