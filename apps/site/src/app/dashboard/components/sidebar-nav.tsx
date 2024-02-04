"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"


export const SidebarNav = (props: { items: { title: string, href: string }[] }) => {
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
          {props.items.map((item) => (
            <Link
              key={item.href}
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
          ))}
        </div>
      </ScrollArea>
    </nav>
  )
}